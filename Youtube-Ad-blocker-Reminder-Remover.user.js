// ==UserScript==
// @name         Remove Adblock Thing
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Removes Adblock Thing
// @author       JoelMatic
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @updateURL    https://github.com/TheRealJoelmatic/RemoveAdblockThing/raw/main/Youtube-Ad-blocker-Reminder-Remover.user.js
// @downloadURL  https://github.com/TheRealJoelmatic/RemoveAdblockThing/raw/main/Youtube-Ad-blocker-Reminder-Remover.user.js
// @grant        none
// ==/UserScript==

(function()
 {
    //
    //      Config
    //

    // Enable The Undetected Adblocker
    const adblocker = true;

    // Enable The Popup remover (pointless if you have the Undetected Adblocker)
    const removePopup = false;

    // Checks for updates (Removes the popup)
    const updateCheck = true;

    // Enable debug messages into the console
    const debugMessages = true;

    //
    //      CODE
    //
    // If you have any suggestions, bug reports,
    // or want to contribute to this userscript,
    // feel free to create issues or pull requests in the GitHub repository.
    //
    // GITHUB: https://github.com/TheRealJoelmatic/RemoveAdblockThing


    //
    // Varables used for the Popup Remover
    //
    const keyEvent = new KeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      keyCode: 75,
      which: 75,
      bubbles: true,
      cancelable: true,
      view: window
    });

    let mouseEvent = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    //This is used to check if the video has been unpaused already
    let unpausedAfterSkip = 0;

    //
    // Varables used for adblock
    //

    // Store the initial URL
    let currentUrl = window.location.href;

    // Used for if there is ad found
    let isAdFound = false;

    //
    // Varables used for updater
    //

    let hasIgnoredUpdate = false;

    //
    // Setup
    //

    //Set everything up here
    if (debugMessages) console.log("Remove Adblock Thing: Script started ");

    if (adblocker) removeAds();
    if (removePopup) popupRemover();
    if (updateCheck) checkForUpdate();

    // Remove Them pesski popups
    function popupRemover() {
        setInterval(() => {

            const fullScreenButton = document.querySelector(".ytp-fullscreen-button");
            const modalOverlay = document.querySelector("tp-yt-iron-overlay-backdrop");
            const popup = document.querySelector(".style-scope ytd-enforcement-message-view-model");
            const popupButton = document.getElementById("dismiss-button");

            const video1 = document.querySelector("#movie_player > video.html5-main-video");
            const video2 = document.querySelector("#movie_player > .html5-video-container > video");

            const bodyStyle = document.body.style;

            bodyStyle.setProperty('overflow-y', 'auto', 'important');

            if (modalOverlay) {
                modalOverlay.removeAttribute("opened");
                modalOverlay.remove();
            }

            if (popup) {
                if (debugMessages) console.log("Remove Adblock Thing: Popup detected, removing...");

                if(popupButton) popupButton.click();

                popup.remove();
                unpausedAfterSkip = 2;

                fullScreenButton.dispatchEvent(mouseEvent);

                setTimeout(() => {
                  fullScreenButton.dispatchEvent(mouseEvent);
                }, 500);

                if (debugMessages) console.log("Remove Adblock Thing: Popup removed");
            }

            // Check if the video is paused after removing the popup
            if (!unpausedAfterSkip > 0) return;

            // UnPause The Video
            unPauseVideo(video1);
            unPauseVideo(video2);

        }, 1000);
    }
    // undetected adblocker method
    function removeAds()
    {

        if (debugMessages) console.log("Remove Adblock Thing: removeAds()");

        var video = document.querySelector('video');
        var videoPlayback = video.playbackRate;

        setInterval(() =>{

            const ad = [...document.querySelectorAll('.ad-showing')][0];
            video = document.querySelector('video');

            //remove page ads
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                removePageAds();
            }

            if (ad)
            {
                isAdFound = true;

                //
                // Speed Skip Method
                //
                if (debugMessages) console.log("Remove Adblock Thing: Found Ad");

                const skipBtn = document.querySelector('.videoAdUiSkipButton,.ytp-ad-skip-button');
                const nonVid = document.querySelector(".ytp-ad-skip-button-modern");

                // Add a little bit of obfuscation when skipping to the end of the video.
                if (video){

                    video.playbackRate = 10;
                    video.volume = 0;

                    if (isNaN(video.duration)){
                        //removed for now as of now cus it cusing problems
                        //var randomNumber = Math.random() * (0.5 - 0.1) + 0.1;
                        video.currentTime = video.duration;
                    }
                    else{
                        video.currentTime = 0;
                    }
                    video.play();

                    skipBtn?.click();
                    nonVid?.click();
                }

                //
                // ad center method
                //

                const openAdCenterButton = document.querySelector('.ytp-ad-button-icon');
                openAdCenterButton?.click();

                var popupContainer = document.querySelector('body > ytd-app > ytd-popup-container > tp-yt-paper-dialog');
                const hidebackdrop = document.querySelector("body > tp-yt-iron-overlay-backdrop");

                if (popupContainer) popupContainer.style.display = 'none';
                if (hidebackdrop) hidebackdrop.style.display = 'none';

                const blockAdButton = document.querySelector('[label="Block ad"]');
                blockAdButton?.click();

                const blockAdButtonConfirm = document.querySelector('.Eddif [label="CONTINUE"] button');
                blockAdButtonConfirm?.click();

                const closeAdCenterButton = document.querySelector('.zBmRhe-Bz112c');
                closeAdCenterButton?.click();


                if (video) video.play();

                if (debugMessages) console.log("Remove Adblock Thing: skipped Ad (✔️)");

            } else {

                //check for unreasonale playback speed
                if(video.playbackRate == 10 && video){
                    video.playbackRate = videoPlayback;
                }

                if (isAdFound){
                    isAdFound = false;

                    // this is right after the ad is skipped
                    // fixes if you set the speed to 2x annd a ad plays it sets it back to the dfualt 1x

                    //somthing bugged out default to 1x then
                    if (videoPlayback == 10){
                        videoPlayback = 1;

                        var _opupContainer = document.querySelector('body > ytd-app > ytd-popup-container > tp-yt-paper-dialog');
                        const _idebackdrop = document.querySelector("body > tp-yt-iron-overlay-backdrop");

                        if (_opupContainer) _opupContainer.style.display = "block";
                        if (_idebackdrop) _idebackdrop.style.display = "block";
                    }

                    if(video) video.playbackRate = videoPlayback;
                }
                else{
                    if(video) videoPlayback = video.playbackRate;
                }
            }

        }, 50)

        removePageAds();
    }
    //removes ads on the page (not video player ads)
    function removePageAds(){

        const sponsor = document.querySelectorAll("div#player-ads.style-scope.ytd-watch-flexy, div#panels.style-scope.ytd-watch-flexy");
        const style = document.createElement('style');

        style.textContent = `
            ytd-action-companion-ad-renderer,
            div#root.style-scope.ytd-display-ad-renderer.yt-simple-endpoint,
            div#sparkles-container.style-scope.ytd-promoted-sparkles-web-renderer,
            div#main-container.style-scope.ytd-promoted-video-renderer,
            ytd-in-feed-ad-layout-renderer,
            .ytd-video-masthead-ad-v3-renderer,
            div#player-ads.style-scope.ytd-watch-flexy,
            yt-about-this-ad-renderer,
            yt-mealbar-promo-renderer,

            #masthead-ad {
                display: none !important;
            }
        `;

        document.head.appendChild(style);

        sponsor?.forEach((element) => {
             if (element.getAttribute("id") === "rendering-content") {
                element.childNodes?.forEach((childElement) => {
                  if (childElement?.data.targetId && childElement?.data.targetId !=="engagement-panel-macro-markers-description-chapters"){
                      //Skipping the Chapters section
                        element.style.display = 'none';
                    }
                   });
            }
         });

         if (debugMessages) console.log("Remove Adblock Thing: Removed page ads (✔️)");
    }

    // Unpause the video Works most of the time
    function unPauseVideo(video)
    {
        if (!video) return;
        if (video.paused) {
            // Simulate pressing the "k" key to unpause the video
            document.dispatchEvent(keyEvent);
            unpausedAfterSkip = 0;
            if (debugMessages) console.log("Remove Adblock Thing: Unpaused video using 'k' key");
        } else if (unpausedAfterSkip > 0) unpausedAfterSkip--;
    }

    //
    // Update check
    //

    function checkForUpdate(){

        if (!(window.location.href.includes("youtube.com"))){
            return;
        }

        if (hasIgnoredUpdate){
            return;
        }

        const scriptUrl = 'https://raw.githubusercontent.com/TheRealJoelmatic/RemoveAdblockThing/main/Youtube-Ad-blocker-Reminder-Remover.user.js';

        fetch(scriptUrl)
        .then(response => response.text())
        .then(data => {
            // Extract version from the script on GitHub
            const match = data.match(/@version\s+(\d+\.\d+)/);
            if (match) {
                const githubVersion = parseFloat(match[1]);
                const currentVersion = parseFloat(GM_info.script.version);

                if (githubVersion > currentVersion) {
                    console.log('Remove Adblock Thing: A new version is available. Please update your script.');

                    var result = window.confirm("Remove Adblock Thing: A new version is available. Please update your script.");

                    if (result) {
                        window.location.replace(scriptUrl);
                    }

                } else {
                    console.log('Remove Adblock Thing: You have the latest version of the script.');
                }
            } else {
                console.error('Remove Adblock Thing: Unable to extract version from the GitHub script.');
            }
        })
        .catch(error => {
            hasIgnoredUpdate = true;
            console.error('Remove Adblock Thing: Error checking for updates:', error);
        });
        hasIgnoredUpdate = true;
    }
})();
