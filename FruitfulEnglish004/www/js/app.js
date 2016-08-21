$(function () {
    'use strict';

    window.app = {};

    var stageMax = 5;
    var questionMax = 6;

    app.alertMessage = function () {
        ons.notification.alert('Tapped!');
    };

    app.intoWorld = function (worldId) {
        document.querySelector('#myNavigator').pushPage('stage.html',
          {
              data: {
                  worldId: worldId
              }
          }
        );
    };
    app.intoStage = function (worldId, stageId) {
        document.querySelector('#myNavigator').pushPage('question.html',
          {
              data: {
                  worldId: worldId,
                  stageId: stageId
              }
          }
        );
    };

    var items = [
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        },
        {
            title: 'はじまりの海',
            thumbnail: 'images/Background/sample1.png'
        },
        {
            title: '雪原の大地',
            thumbnail: 'images/Background/sample3.png'
        },
        {
            title: '試練の砂漠',
            thumbnail: 'images/Background/sample4.png'
        }
    ];

    document.addEventListener('init', function (event) {
        var page = event.target;
        switch (page.id || "") {
            case "world-page":
                app.initWorld(page);
                break;
            case "stage-page":
                app.initStage(page);
                break;
            case "question-page":
                app.initQuestion(page);
                break;
            default:
                break;
        }

    });

    /**
     * progress format
     *
     * progress = {
     *     world: 現在進行中のワールド INDEX (0-23),
     *     world0:[STAGE1, STAGE2, STAGE3, STAGE4, STAGE5 (, EXTRA STAGE)],
     *     // STAGE 進捗 : "" or NULL (未踏) / E (未クリア/挑戦中) / A,B,C (クリア済み) / S (完全クリア)
     *     world1:[],
     *     world2:[],
     *     ………
     *     world23:[]
     * }
     */

    // World Initialization
    app.initWorld = function (page) {
        var onsListContent = $("#world-list").html();
        var progress = JSON.parse(localStorage.getItem("progress")) || {};

        if (!("world" in progress)) {
            progress.world = 0;
        }

        items.forEach(function (item, index) {
            var worldStatus = "invalid";
            var tappable = "";
            if (index <= progress.world) {
                worldStatus = "valid";
                tappable = 'tappable onclick="app.intoWorld(' + index + ')"';
            }

            var onsListItem = '<ons-list-item ' + tappable + ' class="' + worldStatus + '">'
                            + '<div class="center">'
                            + '<div class="list__item__thumbnail world-icon" style="background-image:url(' + item.thumbnail + ');"></div>'
                            + '</div>'
                            + '</ons-list-item>';
            onsListContent += onsListItem;
        });

        $('#world-list').html(onsListContent);
    };

    // Stage Initialization
    app.initStage = function (page) {
        var worldId = (page.data || {}).worldId;
        var item = items[worldId] || {};
        var progress = localStorage.getItem("progress") || {};
        var stage = progress["world" + worldId] || [];

        $("#world-title").html("WORLD " + (worldId + 1) + " : " + item.title);
        $(".world-bg").css("background-image", "url(" + item.thumbnail + ")");

        var stageId = 0;
        var onsListContent = "";
        var onsListItem = $("#stage-list").html();

        var nextStage = 0;
        while (stageId++ < 5) {
            if (!(stageId in stage)) {
                stage[stageId] = "";
            }


            var stageIcon;
            if (nextStage == 0
                && (stage[stageId] == ""
                    || stage[stageId] == "E")
            ) {
                nextStage = stageId;
                stageIcon = "images/Icon/icon_stage_" + stageId + "_arrived.png";
            } else {
                switch (stage[stageId]) {
                    case "":
                    case null:
                        stageIcon = "images/Icon/icon_stage_locked.png";
                        break;
                    case "E":
                        stageIcon = "images/Icon/icon_stage_" + stageId + "_arrived.png";
                        break;
                    case "C":
                    case "B":
                    case "A":
                    case "S":
                        stageIcon = "images/Icon/icon_stage_" + stageId + "_cleared.png";
                        break;
                }
            }


            var stageStatus = "invalid";
            var tappable = "";
            if (stageId <= nextStage) {
                stageStatus = "valid";
                tappable = 'tappable onclick="app.intoStage(' + worldId + ',' + stageId + ')"';
            }

            var onsListItem = '<ons-list-item ' + tappable + ' class="' + stageStatus + '">'
                            + '<div class="center">'
                            + '<div class="list__item__thumbnail stage-icon" style="background-image:url(' + stageIcon + ');"></div>'
                            + '</div>'
                            + '</ons-list-item>';
            onsListContent += onsListItem;
        }

        $('#stage-list').html(onsListContent);
    };

    // Question Initialization
    app.initQuestion = function (page) {
        var worldId = (page.data || {}).worldId;
        var stageId = (page.data || {}).stageId;
        var item = items[worldId] || {};

        $("#stage-title").html("STAGE " + stageId);
        $(".world-bg").css("background-image", "url(" + item.thumbnail + ")");

        var qid = worldId * stageMax * questionMax + (stageId - 1) * questionMax + 700;
        $.ajax({
            url: "media/question.xml",
            type: "get",
            dataType: "xml",
            timeout: 1000,
            success: function (xml, status) {
                var $q = $(xml).find("q[id=" + qid + "]");
                var question = $q.find("en").text();
                $(".english").html(question.replace("###", "(　　　)"));
                $(".japanese").html($q.find("jp").text());

                if ($q.find("hint").length) {
                    $(".hint").html($q.find("hint").text());
                } else {
                    $(".hint").remove();
                }

                $(".answer").val($q.find("answer").text());
                //$(".english").html($q.find("en").text());
            }
        });

        /**
        <div class="question">
            <div class="english"></div>
            <div class="japanese"></div>
            <div class="hint"></div>
            <div class="input-form">
                <input type="text" name="user-answer" maxlength="50" />
            </div>
            <div class="check-button">
                <input type="button" value="Check" />
            </div>
        </div>

        */
    };

});
