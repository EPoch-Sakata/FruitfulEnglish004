$(function () {
    'use strict';

    window.app = {};
    $.extend({
        nl2br: function nl2br(str) {
            return str.replace(/(\r\n|\r|\n)/g, "<br />");
        }
    });

    app.stageMax = 5;
    app.questionMax = 6;
    app.question = "";
    app.result = 0;

    app.alertMessage = function () {
        ons.notification.alert('Tapped!');
    };

    app.intoTitle = function (worldId) {
        if ($("#world-page").length) {
            $("#world-page").remove();
        }
        document.querySelector('#myNavigator').pushPage('world.html', {
            animation: "none"
        });
    };

    app.intoWorld = function (worldId) {
        if ($("#stage-page").length) {
            $("#stage-page").remove();
        }
        document.querySelector('#myNavigator').pushPage('stage.html',
          {
              animation: "none",
              data: {
                  worldId: worldId
              }
          }
        );
    };

    app.intoStage = function (worldId, stageId) {
        document.querySelector('#myNavigator').pushPage('question.html',
          {
              animation: "none",
              data: {
                  worldId: worldId,
                  stageId: stageId
              }
          }
        );
    };

    app.intoResult = function (worldId, stageId) {
        document.querySelector('#myNavigator').pushPage('result.html',
          {
              animation: "none",
              data: {
                  worldId: worldId,
                  stageId: stageId
              }
          }
        );
    };

    document.addEventListener('init', function (event) {
        var page = event.target;
        switch (page.id || "") {
            case "title-page":
                app.initTitle(page);
                break;
            case "world-page":
                app.initWorld(page);
                break;
            case "stage-page":
                app.initStage(page);
                break;
            case "question-page":
                app.initQuestion(page);
                break;
            case "result-page":
                app.initResult(page);
                break;
            default:
                break;
        }

    });

    var defaultStatus = {
        progress: 0,
        last: {
            character: 1,
            background: 1
        },
        world: []
    }

    /**
     * status format
     *
     * status = {
     *     progress: 現在進行中のワールド INDEX (0-23),
     *     last: {
     *         character: 最後に表示したキャラクター,
     *         background: 最後に表示した背景
     *    },
     *     world: [
     *         // STAGE 進捗 : X (未踏) / E (未クリア/挑戦中) / A,B,C (クリア済み) / S (完全クリア)
     *         [STAGE1, STAGE2, STAGE3, STAGE4, STAGE5 (, EXTRA STAGE)],
     *     ]
     * }
     */

    // World Initialization
    app.initTitle = function (page) {
        var status = JSON.parse(localStorage.getItem("status")) || defaultStatus;
        // last displayed
        $(".majon").html('<img src="images/Character/character_' + status.last.character + '.png">');
        $("#title-bg").css("background-image", 'url("images/Background/back_' + status.last.background + '.png")');
    };

    // World Initialization
    app.initWorld = function (page) {
        var onsListContent = $("#world-list").html();
        var status = JSON.parse(localStorage.getItem("status")) || defaultStatus;

        if ($("#result-page").length) {
            $("#result-page").remove();
        }

        WORLDS.forEach(function (item, index) {
            var worldStatus = "invalid";
            var tappable = "";
            if (index <= status.progress) {
                worldStatus = "valid";
                tappable = 'tappable onclick="app.intoWorld(' + index + ')"';
            }

            var onsListItem = '<ons-list-item ' + tappable + ' class="' + worldStatus + '">'
                            + '<div class="center">'
                            + '<div class="list__item__thumbnail world-icon" style="background-image:url(' + item.thumbnail + ');"></div>'
                            + '</div>'
                            + '</ons-list-item>';
            onsListContent += onsListItem;

            // last displayed
            $(".majon").html('<img src="images/Character/character_' + status.last.character + '.png">');
            $("#world-bg").css("background-image", 'url("images/Background/back_' + status.last.background + '.png")');
        });

        $('#world-list').html(onsListContent);
    };

    // Stage Initialization
    app.initStage = function (page) {
        var worldId = (page.data || {}).worldId;
        var item = WORLDS[worldId] || {};
        var status = JSON.parse(localStorage.getItem("status")) || defaultStatus;

        if ($("#result-page").length) {
            $("#result-page").remove();
        }

        if (!((worldId) in status.world)) {
            status.world[worldId] = ["E", "X", "X", "X", "X"];
            localStorage.setItem("status", JSON.stringify(status));
        }

        var stage = status.world[worldId] || [];

        $("#world-title").html("WORLD " + (worldId + 1));
        $(".world-bg").css("background-image", "url(" + item.thumbnail + ")");
        $("#world-message").html("<strong>WORLD " + (worldId + 1) + "</strong><br>" + item.worldMessage);
        $(".majon").html('<img src="images/Character/character_' + status.last.character + '.png">');

        var stageId = 0;
        var onsListContent = "";
        var onsListItem = $("#stage-list").html();

        var stageIcon;
        var stageStatus;
        var tappable;
        while (stageId < 5) {

            switch (stage[stageId]) {
                default:
                case "X":
                    stageStatus = "invalid";
                    tappable = "";
                    stageIcon = "images/Icon/icon_stage_locked.png";
                    break;
                case "E":
                case "C":
                    stageStatus = "valid";
                    tappable = 'tappable onclick="app.intoStage(' + worldId + ',' + stageId + ')"';
                    stageIcon = "images/Icon/icon_stage_" + (stageId + 1) + "_arrived.png";
                    break;
                case "B":
                case "A":
                case "S":
                    stageStatus = "valid";
                    tappable = 'tappable onclick="app.intoStage(' + worldId + ',' + stageId + ')"';
                    stageIcon = "images/Icon/icon_stage_" + (stageId + 1) + "_cleared.png";
                    break;
            }

            var onsListItem = '<ons-list-item ' + tappable + ' class="' + stageStatus + '">'
                            + '<div class="center">'
                            + '<div class="list__item__thumbnail stage-icon" style="background-image:url(' + stageIcon + ');"></div>'
                            + '</div>'
                            + '</ons-list-item>';
            onsListContent += onsListItem;

            stageId++;
        }

        $('#stage-list').html(onsListContent);
    };

    // Question Initialization
    app.initQuestion = function (page) {
        var worldId = (page.data || {}).worldId;
        var stageId = (page.data || {}).stageId;
        var status = JSON.parse(localStorage.getItem("status")) || defaultStatus;
        var questionId = 0;
        var item = WORLDS[worldId] || {};

        app.result = 0;

        if (!(stageId in status.world[worldId])) {
            status.world[worldId][stageId] = "E";
            localStorage.setItem("progress", JSON.stringify(progress));
        }
        
        $("#stage-title").html("STAGE " + (stageId + 1));
        $(".world-bg").css("background-image", "url(" + item.thumbnail + ")");
        setQuestion(worldId, stageId, questionId);
        $(".check-button").click(function (e) {
            // ボタンを無効化
            e.preventDefault();
            $(this).hide();

            var userAnswer = $(".user-answer").val();
            var correctAnswer = $(".correct-answer-text").text().split(",");
            correctAnswer = $.map(correctAnswer, function (val) {
                return $.trim(val);
            });

            if (isCorrect(userAnswer, correctAnswer)) {
                // 正解
                app.result++;
                $(".answer-result .result-correct").show();
                $(".english").html(app.question.replace("###", "<span class='answer-text'>" + userAnswer + "</span>"));
                $(".answer-check .desc-button").show();
                $(".answer-check .next-button").show();
            } else {
                // 不正解
                $(".answer-result .result-incorrect").show();
                $(".english").html(app.question.replace("###", "<span class='answer-text'>" + correctAnswer[0] + "</span>"));
                $(".answer-check .desc-button").show();
            }
        });

        $(".desc-button").click(function (e) {
            e.preventDefault();

            $(this).hide();
            $(".answer-result div").hide();
            $(".question").addClass("after-answer");
            $(".next-button").show();
        });

        $(".next-button").click(function (e) {
            e.preventDefault();
            questionId++;
            if (app.questionMax == questionId) {
                app.intoResult(worldId, stageId);
            } else {
                setQuestion(worldId, stageId, questionId);
            }
        });

        // last displayed
        $(".majon").html('<img src="images/Character/character_' + item.stage[stageId].character + '.png">');
        $("#world-bg").css("background-image", 'url("images/Background/back_' + item.stage[stageId].background + '.png")');
        status.last.character = item.stage[stageId].character;
        status.last.background = item.stage[stageId].background;
        localStorage.setItem("status", JSON.stringify(status));
    };

    function setQuestion(worldId, stageId, questionId)
    {
        var qid = worldId * app.stageMax * app.questionMax + stageId * app.questionMax + questionId + 1;
        var $q;

        return $.ajax({
            url: "media/question.xml",
            type: "get",
            dataType: "xml",
            timeout: 1000,
            success: function (xml, status) {
                // 設問を取得して設定
                $q = $(xml).find("q[id=" + qid + "]");
                app.question = $q.find("en").text();
                $(".qid").html("ID:" + $q.attr("id"));
                $(".english").html(app.question.replace("###", "(　　)"));
                $(".japanese").html($q.find("jp").text());

                if ($q.find("hint").text().length) {
                    $(".hint").html("ヒント : " + $.nl2br($.trim($q.find("hint").text())));
                    $(".hint").show();
                } else {
                    $(".hint").hide();
                }

                // 回答と解説の設定
                $(".correct-answer-text").html($q.find("answer").text());
                $(".description-text").html($.nl2br($.trim($q.find("desc").text())));
                //$(".description-text").html($q.find("desc").text());

                $(".audio").html('<audio src="media/Voice/' + $q.find("sound").text() + '" controls></audio>');

                // 各種ボタン類などの表示・非表示設定
                $(".progress-bar .progress").width(Math.round((questionId + 1) / app.questionMax * 100) + "%");
                $(".input-form .user-answer").val("");
                $(".answer-check .check-button").show();
                $(".answer-check .next-button").hide();
                $(".answer-check .desc-button").hide();
                $(".answer-result div").hide();
                $(".question").removeClass("after-answer");

                if (app.questionMax == (questionId + 1)) {
                    $(".answer-check .next-button").val("Result");
                }
            }
        });
    }

    // Question Initialization
    app.initResult = function (page) {
        var worldId = (page.data || {}).worldId;
        var stageId = (page.data || {}).stageId;
        var status = JSON.parse(localStorage.getItem("status")) || defaultStatus;
        var rank = status.world[worldId][stageId] || [];
        var item = WORLDS[worldId] || {};

        $("#question-page").remove();

        $(".majon-message").html(item.stage[stageId].message);
        $(".majon").html('<img src="images/Character/character_' + item.stage[stageId].character + '.png">');
        $(".world-bg").css("background-image", 'url("images/Background/back_' + item.stage[stageId].background + '.png")');

        if (app.result == 6) {
            rank = "S";
        } else if (app.result == 5) {
            rank = "A";
        } else if (app.result >= 3) {
            rank = "B";
        } else {
            rank = "C";
        }

        $("#result-rank").html("あなたの成績は " + rank + " ランクです。");
        status.world[worldId][stageId] = rank;

        console.log("World ID: " + worldId + " / Stage ID: " + stageId);
        console.log(status);

        $(".stage-button").show();
        $(".world-button").hide();

        if (rank != "C") {
            if (status.world[worldId][stageId + 1] == "X") {
                // unlock next stage (if locked)
                status.world[worldId][stageId + 1] = "E";
            } else if (stageId + 1 == status.world[worldId].length
                       && worldId + 1 > status.progress) {
                // unlock next world (if last stage and not progressed next world)
                status.progress = worldId + 1;
                $(".stage-button").hide();
                $(".world-button").show();
            }
        }

        localStorage.setItem("status", JSON.stringify(status));

        $(".stage-button").click(function (e) {
            e.preventDefault();
            app.intoWorld(worldId);
        });

        $(".world-button").click(function (e) {
            e.preventDefault();
            app.intoTitle();
        });
    }

    /**
     * 正誤判定
     *
     * /// <param name="value" type="String">回答値</param>
     * /// <param name="answer" type="Array">正答一覧</param>
     * @return  boolean     正誤
     */
    function isCorrect(value, answer)
    {
        for (var i in answer) {
            if (value.toLowerCase() == answer[i].toLowerCase()) {
                return true;
            }
        }

        return false;
    }
});
