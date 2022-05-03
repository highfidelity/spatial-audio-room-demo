//
//  Created by Ken Cooke on 3/11/22.
//  Copyright 2022 High Fidelity, Inc.
//
//  The contents of this file are PROPRIETARY AND CONFIDENTIAL, and may not be
//  used, disclosed to third parties, copied or duplicated in any form, in whole
//  or in part, without the prior written consent of High Fidelity, Inc.
//

'use strict';

function decrypt_appid(data, key) {
    let k = BigInt(key.split('').reduce((a, b) => a = Math.imul(a, 33) + b.charCodeAt(0) | 0, 0));
    let t = BigInt('0x' + data) ^ (k * 38038099725390353860267635547n);
    return t.toString(16);
}

// the demo can auto join channel with params in url
$(()=>{
    let urlParams = new URL(location.href).searchParams;
    options.channel = urlParams.get("channel");
    options.password = urlParams.get("password");
    options.username = urlParams.get("username");
    if (options.channel && options.password) {
        $("#channel").val(options.channel);
        $("#password").val(options.password);
        $("#username").val(options.username);
        //$("#join-form").submit();
    }
}
)

$("#username").change(function (e) {
    options.username = $("#username").val();

    // if already connected, update my name
    setUsername(options.username)
})

$("#join-form").submit(async function(e) {
    e.preventDefault();
    $("#join").attr("disabled", true);
    try {
        options.appid = decrypt_appid($("#appid").val(), $("#password").val());
        options.token = $("#token").val();
        options.channel = $("#channel").val();
        options.username = $("#username").val();
        await join();
        $("#success-alert").css("display", "block");
    } catch (error) {
        console.error(error);
    } finally {
        $("#leave").attr("disabled", false);
    }
})

$("#leave").click(function(e) {
    leaveRoom();
    $("#success-alert").css("display", "none");
})

$("#aec").click(async function(e) {
    // toggle the state
    isAecEnabled = !isAecEnabled;
    $("#aec").css("background-color", isAecEnabled ? "purple" : "");

    // if already connected, leave and rejoin
    if (localTracks.audioTrack) {
        await leaveRoom();
        $("#join").attr("disabled", true);
        await join();
        $("#leave").attr("disabled", false);
    }
})

$("#mute").click(function(e) {
    // toggle the state
    isMuteEnabled = !isMuteEnabled;
    $("#mute").css("background-color", isMuteEnabled ? "purple" : "");

    // if muted, set gate threshold to 0dB, else follow slider
    setThreshold(isMuteEnabled ? 0.0 : threshold.value);
})

$("#sound").click(function(e) {
    playSoundEffect();
})

// threshold slider
threshold.oninput = () => {
    if (!isMuteEnabled) {
        setThreshold(threshold.value);
    }
    document.getElementById("threshold-value").value = threshold.value;
}

let canvasControl;
const canvasDimensions = { width: 8, height: 8 };   // in meters
let elements = [];
let localUid = undefined;
let usernames = {};


// called when the user drags around their own dot...
function updatePositions(elements) {
    // only update the listener
    let e = elements.find(e => e.clickable === true);
    if (e !== undefined) {
        // transform canvas to audio coordinates
        setLocalMetaData((e.x - 0.5) * canvasDimensions.width,
                         -(e.y - 0.5) * canvasDimensions.height,
                         e.o);
    }
}


function updateRemotePosition(x, y, o) {
    // update canvas position
    let e = elements.find(e => e.uid === uid);
    if (e !== undefined) {
        e.x = 0.5 + (x / canvasDimensions.width);
        e.y = 0.5 - (y / canvasDimensions.height);
        e.o = o;
    }
}


function updateVolumeIndicator(volume, index) {
    let e = elements.find(e => e.uid === volume.uid);
    if (e !== undefined)
        e.radius = 0.02 + 0.04 * volume.level/100;
}


function receiveRemoteMetadata(uid, data) {
    usernames[uid] = (new TextDecoder).decode(data);
    console.log('%creceived stream-message from:', 'color:cyan', usernames[uid]);
}


function onUserPublished(uid) {
    elements.push({
        icon: 'sourceIcon',
        radius: 0.02,
        alpha: 0.5,
        clickable: false,
        uid,
    });

    // broadcast my name
    sendBroadcastMessage((new TextEncoder).encode(usernames[localID]));
}


function onUserUnpublished(uid) {
    $(`#player-wrapper-${id}`).remove();

    // find and remove this uid
    let i = elements.findIndex(e => e.uid === uid);
    elements.splice(i, 1);
}


async function joinRoom() {

    localUid = join(updateRemotePosition,
                    receiveRemoteMetadata,
                    updateVolumeIndicator,
                    onUserPublished,
                    onUserUnpublished,
                    threshold.value);

    usernames[ localUid ] = options.username;

    //
    // canvas GUI
    //
    let canvas = document.getElementById('canvas');

    elements.push({
        icon: 'listenerIcon',
        x: 0.5 + (hifiPosition.x / canvasDimensions.width),
        y: 0.5 - (hifiPosition.y / canvasDimensions.height),
        o: hifiPosition.o,
        radius: 0.02,
        alpha: 0.5,
        clickable: true,
        uid: localUid,
    });

    canvasControl = new CanvasControl(canvas, elements, updatePositions);
    canvasControl.draw();

    $("#sound").attr("hidden", false);
}


async function leaveRoom() {
    await leave();

    // remove remote users and player views
    $("#remote-playerlist").html("");

    $("#local-player-name").text("");
    $("#join").attr("disabled", false);
    $("#leave").attr("disabled", true);

    elements.length = 0;

    $("#sound").attr("hidden", true);
}


function setUsername(username : string) {
    sendBroadcastMessage((new TextEncoder).encode(usernames[localUid]));
    if (localTracks.audioTrack) {
        usernames[localUid] = username;
        client.sendStreamMessage((new TextEncoder).encode(usernames[localUid]));
        console.log('%cusername changed, sent stream-message of:', 'color:cyan', usernames[localUid]);
    }
}
