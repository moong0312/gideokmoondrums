/* ===========================================================================
   Gideok Moon — EPK
   Everything a promoter or a writer needs in one place: what has been said,
   biographies at three lengths, photographs to download, and how to get hold
   of him.
   =========================================================================== */
(function () {
  "use strict";

  var GM = window.GM, $ = GM.$;

  GM.boot(function () {
    GM.quotes($("#quotes"));
    GM.bios($("#bios"));
    GM.photos($("#photos"));
    GM.contact($("#contact"));
    GM.social($("#social"));
  });
})();
