(function () {
    'use strict';

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-pgn
     * License: MIT, see file 'LICENSE'
     */
    const TAGS = {
      // Standard "Seven Tag Roster"
      Event: "Event",
      // the name of the tournament or match event
      Site: "Site",
      // the location of the event
      Date: "Date",
      // the starting date of the game (format: YYYY.MM.TT)
      Round: "Round",
      // the playing round ordinal of the game
      White: "White",
      // the player of the white pieces (last name, pre name)
      Black: "Black",
      // the player of the black pieces (last name, pre name)
      Result: "Result",
      // the result of the game (1-0, 1/2-1/2, 0-1, *)
      // Optional (http://www.saremba.de/chessgml/standards/pgn/pgn-complete.htm#c9)
      //      Player related information
      WhiteTitle: "WhiteTitle",
      BlackTitle: "BlackTitle",
      // These use string values such as "FM", "IM", and "GM"; these tags are used only for the standard abbreviations for FIDE titles. A value of "-" is used for an untitled player.
      WhiteElo: "WhiteElo",
      BlackElo: "BlackElo",
      // These tags use integer values; these are used for FIDE Elo ratings. A value of "-" is used for an unrated player.
      WhiteUSCF: "WhiteUSCF",
      BlackUSCF: "BlackUSCF",
      // These tags use integer values; these are used for USCF (United States Chess Federation) ratings. Similar tag names can be constructed for other rating agencies.
      WhiteNA: "WhiteNA",
      BlackNA: "BlackNA:",
      // These tags use string values; these are the e-mail or network addresses of the players. A value of "-" is used for a player without an electronic address.
      WhiteType: "WhiteType",
      BlackType: "BlackType",
      // These tags use string values; these describe the player types. The value "human" should be used for a person while the value "program" should be used for algorithmic (computer) players.
      //      Event related information
      EventDate: "EventDate",
      // This uses a date value, similar to the Date tag field, that gives the starting date of the Event.
      EventSponsor: "EventSponsor",
      // This uses a string value giving the name of the sponsor of the event.
      Section: "Section",
      // This uses a string; this is used for the playing section of a tournament (e.g., "Open" or "Reserve").
      Stage: "Stage",
      // This uses a string; this is used for the stage of a multistage event (e.g., "Preliminary" or "Semifinal").
      Board: "Board",
      // This uses an integer; this identifies the board number in a team event and also in a simultaneous exhibition.
      //      Opening information (locale specific)
      Opening: "Opening",
      // This uses a string; this is used for the traditional opening name. This will vary by locale. This tag pair is associated with the use of the EPD opcode "v0" described in a later section of this document.
      ECO: "ECO",
      // This uses a string of either the form "XDD" or the form "XDD/DD" where the "X" is a letter from "A" to "E" and the "D" positions are digits.
      //      Time and date related information
      Time: "Time",
      // Time the game started, in "HH:MM:SS" format, in local clock time.
      UTCTime: "UTCTime",
      // This tag is similar to the Time tag except that the time is given according to the Universal Coordinated Time standard.
      UTCDate: "UTCDate",
      // This tag is similar to the Date tag except that the date is given according to the Universal Coordinated Time standard.
      //      Time control
      TimeControl: "TimeControl",
      // 40/7200:3600 (moves per seconds: sudden death seconds)
      //      Alternative starting positions
      SetUp: "SetUp",
      // "0": position is start position, "1": tag FEN defines the position
      FEN: "FEN",
      //  Alternative start position, tag SetUp has to be set to "1"
      //      Game conclusion
      Termination: "Termination",
      // Gives more details about the termination of the game. It may be "abandoned", "adjudication" (result determined by third-party adjudication), "death", "emergency", "normal", "rules infraction", "time forfeit", or "unterminated".
      //      Miscellaneous
      Annotator: "Annotator",
      // The person providing notes to the game.
      Mode: "Mode",
      // "OTB" (over-the-board) "ICS" (Internet Chess Server)
      PlyCount: "PlyCount" // String value denoting total number of half-moves played.

    };
    class Header {
      constructor(headerString = "") {
        this.clear();
        const rows = headerString.match(/\[([^\]]+)]/g);

        if (rows && rows.length > 0) {
          for (let i = 0; i < rows.length; i++) {
            let tag = rows[i].match(/\[(\w+)\s+"([^"]+)"/);

            if (tag) {
              this.tags[tag[1]] = tag[2];
            }
          }
        }
      }

      clear() {
        this.tags = {};
      }

      render() {
        let rendered = "";

        for (const tag in this.tags) {
          rendered += `[${tag} "${this.tags[tag]}"]\n`;
        }

        return rendered;
      }

    }

    /*
     * Generated by PEG.js 0.10.0.
     *
     * http://pegjs.org/
     */

    function peg$subclass(child, parent) {
      function ctor() {
        this.constructor = child;
      }

      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
    }

    function peg$SyntaxError(message, expected, found, location) {
      this.message = message;
      this.expected = expected;
      this.found = found;
      this.location = location;
      this.name = "SyntaxError";

      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, peg$SyntaxError);
      }
    }

    peg$subclass(peg$SyntaxError, Error);

    peg$SyntaxError.buildMessage = function (expected, found) {
      var DESCRIBE_EXPECTATION_FNS = {
        literal: function (expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },
        "class": function (expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },
        any: function (expectation) {
          return "any character";
        },
        end: function (expectation) {
          return "end of input";
        },
        other: function (expectation) {
          return expectation.description;
        }
      };

      function hex(ch) {
        return ch.charCodeAt(0).toString(16).toUpperCase();
      }

      function literalEscape(s) {
        return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
          return '\\x0' + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
          return '\\x' + hex(ch);
        });
      }

      function classEscape(s) {
        return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
          return '\\x0' + hex(ch);
        }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
          return '\\x' + hex(ch);
        });
      }

      function describeExpectation(expectation) {
        return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
      }

      function describeExpected(expected) {
        var descriptions = new Array(expected.length),
            i,
            j;

        for (i = 0; i < expected.length; i++) {
          descriptions[i] = describeExpectation(expected[i]);
        }

        descriptions.sort();

        if (descriptions.length > 0) {
          for (i = 1, j = 1; i < descriptions.length; i++) {
            if (descriptions[i - 1] !== descriptions[i]) {
              descriptions[j] = descriptions[i];
              j++;
            }
          }

          descriptions.length = j;
        }

        switch (descriptions.length) {
          case 1:
            return descriptions[0];

          case 2:
            return descriptions[0] + " or " + descriptions[1];

          default:
            return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
        }
      }

      function describeFound(found) {
        return found ? "\"" + literalEscape(found) + "\"" : "end of input";
      }

      return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    };

    function peg$parse(input, options) {
      options = options !== void 0 ? options : {};

      var peg$FAILED = {},
          peg$startRuleFunctions = {
        pgn: peg$parsepgn
      },
          peg$startRuleFunction = peg$parsepgn,
          peg$c0 = function (pw, all) {
        var arr = all ? all : [];
        arr.unshift(pw);
        return arr;
      },
          peg$c1 = function (pb, all) {
        var arr = all ? all : [];
        arr.unshift(pb);
        return arr;
      },
          peg$c2 = function () {
        return [[]];
      },
          peg$c3 = function (pw) {
        return pw;
      },
          peg$c4 = function (pb) {
        return pb;
      },
          peg$c5 = function (cm, mn, cb, hm, nag, ca, vari, all) {
        var arr = all ? all : [];
        var move = {};
        move.turn = 'w';
        move.moveNumber = mn;
        move.notation = hm;
        move.commentBefore = cb;
        move.commentAfter = ca;
        move.commentMove = cm;
        move.variations = vari ? vari : [];
        move.nag = nag ? nag : null;
        arr.unshift(move);
        return arr;
      },
          peg$c6 = function (cm, me, cb, hm, nag, ca, vari, all) {
        var arr = all ? all : [];
        var move = {};
        move.turn = 'b';
        move.moveNumber = me;
        move.notation = hm;
        move.commentBefore = cb;
        move.commentAfter = ca;
        move.variations = vari ? vari : [];
        arr.unshift(move);
        move.nag = nag ? nag : null;
        return arr;
      },
          peg$c7 = "1:0",
          peg$c8 = peg$literalExpectation("1:0", false),
          peg$c9 = function () {
        return ["1:0"];
      },
          peg$c10 = "0:1",
          peg$c11 = peg$literalExpectation("0:1", false),
          peg$c12 = function () {
        return ["0:1"];
      },
          peg$c13 = "1-0",
          peg$c14 = peg$literalExpectation("1-0", false),
          peg$c15 = function () {
        return ["1-0"];
      },
          peg$c16 = "0-1",
          peg$c17 = peg$literalExpectation("0-1", false),
          peg$c18 = function () {
        return ["0-1"];
      },
          peg$c19 = "1/2-1/2",
          peg$c20 = peg$literalExpectation("1/2-1/2", false),
          peg$c21 = function () {
        return ["1/2-1/2"];
      },
          peg$c22 = "*",
          peg$c23 = peg$literalExpectation("*", false),
          peg$c24 = function () {
        return ["*"];
      },
          peg$c25 = /^[^}]/,
          peg$c26 = peg$classExpectation(["}"], true, false),
          peg$c27 = function (cm) {
        return cm.join("").trim();
      },
          peg$c28 = "{",
          peg$c29 = peg$literalExpectation("{", false),
          peg$c30 = "}",
          peg$c31 = peg$literalExpectation("}", false),
          peg$c32 = function (vari, all, me) {
        var arr = all ? all : [];
        arr.unshift(vari);
        return arr;
      },
          peg$c33 = function (vari, all) {
        var arr = all ? all : [];
        arr.unshift(vari);
        return arr;
      },
          peg$c34 = "(",
          peg$c35 = peg$literalExpectation("(", false),
          peg$c36 = ")",
          peg$c37 = peg$literalExpectation(")", false),
          peg$c38 = ".",
          peg$c39 = peg$literalExpectation(".", false),
          peg$c40 = function (num) {
        return num;
      },
          peg$c41 = peg$otherExpectation("integer"),
          peg$c42 = /^[0-9]/,
          peg$c43 = peg$classExpectation([["0", "9"]], false, false),
          peg$c44 = function (digits) {
        return makeInteger(digits);
      },
          peg$c45 = " ",
          peg$c46 = peg$literalExpectation(" ", false),
          peg$c47 = function () {
        return '';
      },
          peg$c48 = function (fig, disc, str, col, row, pr, ch) {
        var hm = {};
        hm.fig = fig ? fig : null;
        hm.disc = disc ? disc : null;
        hm.strike = str ? str : null;
        hm.col = col;
        hm.row = row;
        hm.check = ch ? ch : null;
        hm.promotion = pr;
        hm.notation = (fig ? fig : "") + (disc ? disc : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
        return hm;
      },
          peg$c49 = function (fig, cols, rows, str, col, row, pr, ch) {
        var hm = {};
        hm.fig = fig ? fig : null;
        hm.strike = str == 'x' ? str : null;
        hm.col = col;
        hm.row = row;
        hm.check = ch ? ch : null;
        hm.notation = (fig && fig !== 'P' ? fig : "") + cols + rows + (str == 'x' ? str : "-") + col + row + (pr ? pr : "") + (ch ? ch : "");
        hm.promotion = pr;
        return hm;
      },
          peg$c50 = function (fig, str, col, row, pr, ch) {
        var hm = {};
        hm.fig = fig ? fig : null;
        hm.strike = str ? str : null;
        hm.col = col;
        hm.row = row;
        hm.check = ch ? ch : null;
        hm.notation = (fig ? fig : "") + (str ? str : "") + col + row + (pr ? pr : "") + (ch ? ch : "");
        hm.promotion = pr;
        return hm;
      },
          peg$c51 = "O-O-O",
          peg$c52 = peg$literalExpectation("O-O-O", false),
          peg$c53 = function (ch) {
        var hm = {};
        hm.notation = 'O-O-O' + (ch ? ch : "");
        hm.check = ch ? ch : null;
        return hm;
      },
          peg$c54 = "O-O",
          peg$c55 = peg$literalExpectation("O-O", false),
          peg$c56 = function (ch) {
        var hm = {};
        hm.notation = 'O-O' + (ch ? ch : "");
        hm.check = ch ? ch : null;
        return hm;
      },
          peg$c57 = "+-",
          peg$c58 = peg$literalExpectation("+-", false),
          peg$c59 = "+",
          peg$c60 = peg$literalExpectation("+", false),
          peg$c61 = function (ch) {
        return ch[1];
      },
          peg$c62 = "$$$",
          peg$c63 = peg$literalExpectation("$$$", false),
          peg$c64 = "#",
          peg$c65 = peg$literalExpectation("#", false),
          peg$c66 = "=",
          peg$c67 = peg$literalExpectation("=", false),
          peg$c68 = function (f) {
        return '=' + f;
      },
          peg$c69 = function (nag, nags) {
        var arr = nags ? nags : [];
        arr.unshift(nag);
        return arr;
      },
          peg$c70 = "$",
          peg$c71 = peg$literalExpectation("$", false),
          peg$c72 = function (num) {
        return '$' + num;
      },
          peg$c73 = "!!",
          peg$c74 = peg$literalExpectation("!!", false),
          peg$c75 = function () {
        return '$3';
      },
          peg$c76 = "??",
          peg$c77 = peg$literalExpectation("??", false),
          peg$c78 = function () {
        return '$4';
      },
          peg$c79 = "!?",
          peg$c80 = peg$literalExpectation("!?", false),
          peg$c81 = function () {
        return '$5';
      },
          peg$c82 = "?!",
          peg$c83 = peg$literalExpectation("?!", false),
          peg$c84 = function () {
        return '$6';
      },
          peg$c85 = "!",
          peg$c86 = peg$literalExpectation("!", false),
          peg$c87 = function () {
        return '$1';
      },
          peg$c88 = "?",
          peg$c89 = peg$literalExpectation("?", false),
          peg$c90 = function () {
        return '$2';
      },
          peg$c91 = "\u203C",
          peg$c92 = peg$literalExpectation("\u203C", false),
          peg$c93 = "\u2047",
          peg$c94 = peg$literalExpectation("\u2047", false),
          peg$c95 = "\u2049",
          peg$c96 = peg$literalExpectation("\u2049", false),
          peg$c97 = "\u2048",
          peg$c98 = peg$literalExpectation("\u2048", false),
          peg$c99 = "\u25A1",
          peg$c100 = peg$literalExpectation("\u25A1", false),
          peg$c101 = function () {
        return '$7';
      },
          peg$c102 = function () {
        return '$10';
      },
          peg$c103 = "\u221E",
          peg$c104 = peg$literalExpectation("\u221E", false),
          peg$c105 = function () {
        return '$13';
      },
          peg$c106 = "\u2A72",
          peg$c107 = peg$literalExpectation("\u2A72", false),
          peg$c108 = function () {
        return '$14';
      },
          peg$c109 = "\u2A71",
          peg$c110 = peg$literalExpectation("\u2A71", false),
          peg$c111 = function () {
        return '$15';
      },
          peg$c112 = "\xB1",
          peg$c113 = peg$literalExpectation("\xB1", false),
          peg$c114 = function () {
        return '$16';
      },
          peg$c115 = "\u2213",
          peg$c116 = peg$literalExpectation("\u2213", false),
          peg$c117 = function () {
        return '$17';
      },
          peg$c118 = function () {
        return '$18';
      },
          peg$c119 = "-+",
          peg$c120 = peg$literalExpectation("-+", false),
          peg$c121 = function () {
        return '$19';
      },
          peg$c122 = "\u2A00",
          peg$c123 = peg$literalExpectation("\u2A00", false),
          peg$c124 = function () {
        return '$22';
      },
          peg$c125 = "\u27F3",
          peg$c126 = peg$literalExpectation("\u27F3", false),
          peg$c127 = function () {
        return '$32';
      },
          peg$c128 = "\u2192",
          peg$c129 = peg$literalExpectation("\u2192", false),
          peg$c130 = function () {
        return '$36';
      },
          peg$c131 = "\u2191",
          peg$c132 = peg$literalExpectation("\u2191", false),
          peg$c133 = function () {
        return '$40';
      },
          peg$c134 = "\u21C6",
          peg$c135 = peg$literalExpectation("\u21C6", false),
          peg$c136 = function () {
        return '$132';
      },
          peg$c137 = "D",
          peg$c138 = peg$literalExpectation("D", false),
          peg$c139 = function () {
        return '$220';
      },
          peg$c140 = /^[RNBQKP]/,
          peg$c141 = peg$classExpectation(["R", "N", "B", "Q", "K", "P"], false, false),
          peg$c142 = /^[a-h]/,
          peg$c143 = peg$classExpectation([["a", "h"]], false, false),
          peg$c144 = /^[1-8]/,
          peg$c145 = peg$classExpectation([["1", "8"]], false, false),
          peg$c146 = "x",
          peg$c147 = peg$literalExpectation("x", false),
          peg$c148 = "-",
          peg$c149 = peg$literalExpectation("-", false),
          peg$currPos = 0,
          peg$posDetailsCache = [{
        line: 1,
        column: 1
      }],
          peg$maxFailPos = 0,
          peg$maxFailExpected = [],
          peg$silentFails = 0,
          peg$result;

      if ("startRule" in options) {
        if (!(options.startRule in peg$startRuleFunctions)) {
          throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }

        peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
      }

      function peg$literalExpectation(text, ignoreCase) {
        return {
          type: "literal",
          text: text,
          ignoreCase: ignoreCase
        };
      }

      function peg$classExpectation(parts, inverted, ignoreCase) {
        return {
          type: "class",
          parts: parts,
          inverted: inverted,
          ignoreCase: ignoreCase
        };
      }

      function peg$endExpectation() {
        return {
          type: "end"
        };
      }

      function peg$otherExpectation(description) {
        return {
          type: "other",
          description: description
        };
      }

      function peg$computePosDetails(pos) {
        var details = peg$posDetailsCache[pos],
            p;

        if (details) {
          return details;
        } else {
          p = pos - 1;

          while (!peg$posDetailsCache[p]) {
            p--;
          }

          details = peg$posDetailsCache[p];
          details = {
            line: details.line,
            column: details.column
          };

          while (p < pos) {
            if (input.charCodeAt(p) === 10) {
              details.line++;
              details.column = 1;
            } else {
              details.column++;
            }

            p++;
          }

          peg$posDetailsCache[pos] = details;
          return details;
        }
      }

      function peg$computeLocation(startPos, endPos) {
        var startPosDetails = peg$computePosDetails(startPos),
            endPosDetails = peg$computePosDetails(endPos);
        return {
          start: {
            offset: startPos,
            line: startPosDetails.line,
            column: startPosDetails.column
          },
          end: {
            offset: endPos,
            line: endPosDetails.line,
            column: endPosDetails.column
          }
        };
      }

      function peg$fail(expected) {
        if (peg$currPos < peg$maxFailPos) {
          return;
        }

        if (peg$currPos > peg$maxFailPos) {
          peg$maxFailPos = peg$currPos;
          peg$maxFailExpected = [];
        }

        peg$maxFailExpected.push(expected);
      }

      function peg$buildStructuredError(expected, found, location) {
        return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
      }

      function peg$parsepgn() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parsepgnStartWhite();

        if (s1 !== peg$FAILED) {
          s2 = peg$parsepgnBlack();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c0(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsepgnStartBlack();

          if (s1 !== peg$FAILED) {
            s2 = peg$parsepgnWhite();

            if (s2 === peg$FAILED) {
              s2 = null;
            }

            if (s2 !== peg$FAILED) {
              s1 = peg$c1(s1, s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parsewhiteSpace();

            if (s1 === peg$FAILED) {
              s1 = null;
            }

            if (s1 !== peg$FAILED) {
              s1 = peg$c2();
            }

            s0 = s1;
          }
        }

        return s0;
      }

      function peg$parsepgnStartWhite() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parsepgnWhite();

        if (s1 !== peg$FAILED) {
          s1 = peg$c3(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parsepgnStartBlack() {
        var s0, s1;
        s0 = peg$currPos;
        s1 = peg$parsepgnBlack();

        if (s1 !== peg$FAILED) {
          s1 = peg$c4(s1);
        }

        s0 = s1;
        return s0;
      }

      function peg$parsepgnWhite() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
        s0 = peg$currPos;
        s1 = peg$parsewhiteSpace();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parsecomment();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parsewhiteSpace();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parsemoveNumber();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parsewhiteSpace();

                if (s5 === peg$FAILED) {
                  s5 = null;
                }

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecomment();

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parsewhiteSpace();

                    if (s7 === peg$FAILED) {
                      s7 = null;
                    }

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsehalfMove();

                      if (s8 !== peg$FAILED) {
                        s9 = peg$parsewhiteSpace();

                        if (s9 === peg$FAILED) {
                          s9 = null;
                        }

                        if (s9 !== peg$FAILED) {
                          s10 = peg$parsenags();

                          if (s10 === peg$FAILED) {
                            s10 = null;
                          }

                          if (s10 !== peg$FAILED) {
                            s11 = peg$parsewhiteSpace();

                            if (s11 === peg$FAILED) {
                              s11 = null;
                            }

                            if (s11 !== peg$FAILED) {
                              s12 = peg$parsecomment();

                              if (s12 === peg$FAILED) {
                                s12 = null;
                              }

                              if (s12 !== peg$FAILED) {
                                s13 = peg$parsewhiteSpace();

                                if (s13 === peg$FAILED) {
                                  s13 = null;
                                }

                                if (s13 !== peg$FAILED) {
                                  s14 = peg$parsevariationWhite();

                                  if (s14 === peg$FAILED) {
                                    s14 = null;
                                  }

                                  if (s14 !== peg$FAILED) {
                                    s15 = peg$parsepgnBlack();

                                    if (s15 === peg$FAILED) {
                                      s15 = null;
                                    }

                                    if (s15 !== peg$FAILED) {
                                      s1 = peg$c5(s2, s4, s6, s8, s10, s12, s14, s15);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parseendGame();
        }

        return s0;
      }

      function peg$parsepgnBlack() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8, s9, s10, s11, s12, s13, s14, s15;
        s0 = peg$currPos;
        s1 = peg$parsewhiteSpace();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parsecomment();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parsewhiteSpace();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s4 = peg$parsemoveEllipse();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parsewhiteSpace();

                if (s5 === peg$FAILED) {
                  s5 = null;
                }

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsecomment();

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parsewhiteSpace();

                    if (s7 === peg$FAILED) {
                      s7 = null;
                    }

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsehalfMove();

                      if (s8 !== peg$FAILED) {
                        s9 = peg$parsewhiteSpace();

                        if (s9 === peg$FAILED) {
                          s9 = null;
                        }

                        if (s9 !== peg$FAILED) {
                          s10 = peg$parsenags();

                          if (s10 === peg$FAILED) {
                            s10 = null;
                          }

                          if (s10 !== peg$FAILED) {
                            s11 = peg$parsewhiteSpace();

                            if (s11 === peg$FAILED) {
                              s11 = null;
                            }

                            if (s11 !== peg$FAILED) {
                              s12 = peg$parsecomment();

                              if (s12 === peg$FAILED) {
                                s12 = null;
                              }

                              if (s12 !== peg$FAILED) {
                                s13 = peg$parsewhiteSpace();

                                if (s13 === peg$FAILED) {
                                  s13 = null;
                                }

                                if (s13 !== peg$FAILED) {
                                  s14 = peg$parsevariationBlack();

                                  if (s14 === peg$FAILED) {
                                    s14 = null;
                                  }

                                  if (s14 !== peg$FAILED) {
                                    s15 = peg$parsepgnWhite();

                                    if (s15 === peg$FAILED) {
                                      s15 = null;
                                    }

                                    if (s15 !== peg$FAILED) {
                                      s1 = peg$c6(s2, s4, s6, s8, s10, s12, s14, s15);
                                      s0 = s1;
                                    } else {
                                      peg$currPos = s0;
                                      s0 = peg$FAILED;
                                    }
                                  } else {
                                    peg$currPos = s0;
                                    s0 = peg$FAILED;
                                  }
                                } else {
                                  peg$currPos = s0;
                                  s0 = peg$FAILED;
                                }
                              } else {
                                peg$currPos = s0;
                                s0 = peg$FAILED;
                              }
                            } else {
                              peg$currPos = s0;
                              s0 = peg$FAILED;
                            }
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$parseendGame();
        }

        return s0;
      }

      function peg$parseendGame() {
        var s0, s1;
        s0 = peg$currPos;

        if (input.substr(peg$currPos, 3) === peg$c7) {
          s1 = peg$c7;
          peg$currPos += 3;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c8);
          }
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c9();
        }

        s0 = s1;

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;

          if (input.substr(peg$currPos, 3) === peg$c10) {
            s1 = peg$c10;
            peg$currPos += 3;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c11);
            }
          }

          if (s1 !== peg$FAILED) {
            s1 = peg$c12();
          }

          s0 = s1;

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;

            if (input.substr(peg$currPos, 3) === peg$c13) {
              s1 = peg$c13;
              peg$currPos += 3;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c14);
              }
            }

            if (s1 !== peg$FAILED) {
              s1 = peg$c15();
            }

            s0 = s1;

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;

              if (input.substr(peg$currPos, 3) === peg$c16) {
                s1 = peg$c16;
                peg$currPos += 3;
              } else {
                s1 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c17);
                }
              }

              if (s1 !== peg$FAILED) {
                s1 = peg$c18();
              }

              s0 = s1;

              if (s0 === peg$FAILED) {
                s0 = peg$currPos;

                if (input.substr(peg$currPos, 7) === peg$c19) {
                  s1 = peg$c19;
                  peg$currPos += 7;
                } else {
                  s1 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c20);
                  }
                }

                if (s1 !== peg$FAILED) {
                  s1 = peg$c21();
                }

                s0 = s1;

                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;

                  if (input.charCodeAt(peg$currPos) === 42) {
                    s1 = peg$c22;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c23);
                    }
                  }

                  if (s1 !== peg$FAILED) {
                    s1 = peg$c24();
                  }

                  s0 = s1;
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parsecomment() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parsecl();

        if (s1 !== peg$FAILED) {
          s2 = [];

          if (peg$c25.test(input.charAt(peg$currPos))) {
            s3 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c26);
            }
          }

          while (s3 !== peg$FAILED) {
            s2.push(s3);

            if (peg$c25.test(input.charAt(peg$currPos))) {
              s3 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c26);
              }
            }
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parsecr();

            if (s3 !== peg$FAILED) {
              s1 = peg$c27(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsecl() {
        var s0;

        if (input.charCodeAt(peg$currPos) === 123) {
          s0 = peg$c28;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c29);
          }
        }

        return s0;
      }

      function peg$parsecr() {
        var s0;

        if (input.charCodeAt(peg$currPos) === 125) {
          s0 = peg$c30;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c31);
          }
        }

        return s0;
      }

      function peg$parsevariationWhite() {
        var s0, s1, s2, s3, s4, s5, s6, s7;
        s0 = peg$currPos;
        s1 = peg$parsepl();

        if (s1 !== peg$FAILED) {
          s2 = peg$parsepgnWhite();

          if (s2 !== peg$FAILED) {
            s3 = peg$parsepr();

            if (s3 !== peg$FAILED) {
              s4 = peg$parsewhiteSpace();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parsevariationWhite();

                if (s5 === peg$FAILED) {
                  s5 = null;
                }

                if (s5 !== peg$FAILED) {
                  s6 = peg$parsewhiteSpace();

                  if (s6 === peg$FAILED) {
                    s6 = null;
                  }

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parsemoveEllipse();

                    if (s7 === peg$FAILED) {
                      s7 = null;
                    }

                    if (s7 !== peg$FAILED) {
                      s1 = peg$c32(s2, s5);
                      s0 = s1;
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsevariationBlack() {
        var s0, s1, s2, s3, s4, s5;
        s0 = peg$currPos;
        s1 = peg$parsepl();

        if (s1 !== peg$FAILED) {
          s2 = peg$parsepgnStartBlack();

          if (s2 !== peg$FAILED) {
            s3 = peg$parsepr();

            if (s3 !== peg$FAILED) {
              s4 = peg$parsewhiteSpace();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parsevariationBlack();

                if (s5 === peg$FAILED) {
                  s5 = null;
                }

                if (s5 !== peg$FAILED) {
                  s1 = peg$c33(s2, s5);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsepl() {
        var s0;

        if (input.charCodeAt(peg$currPos) === 40) {
          s0 = peg$c34;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c35);
          }
        }

        return s0;
      }

      function peg$parsepr() {
        var s0;

        if (input.charCodeAt(peg$currPos) === 41) {
          s0 = peg$c36;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c37);
          }
        }

        return s0;
      }

      function peg$parsemoveNumber() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = peg$parseinteger();

        if (s1 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 46) {
            s2 = peg$c38;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c39);
            }
          }

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c40(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parseinteger() {
        var s0, s1, s2;
        peg$silentFails++;
        s0 = peg$currPos;
        s1 = [];

        if (peg$c42.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c43);
          }
        }

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);

            if (peg$c42.test(input.charAt(peg$currPos))) {
              s2 = input.charAt(peg$currPos);
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c43);
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c44(s1);
        }

        s0 = s1;
        peg$silentFails--;

        if (s0 === peg$FAILED) {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c41);
          }
        }

        return s0;
      }

      function peg$parsewhiteSpace() {
        var s0, s1, s2;
        s0 = peg$currPos;
        s1 = [];

        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c45;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c46);
          }
        }

        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);

            if (input.charCodeAt(peg$currPos) === 32) {
              s2 = peg$c45;
              peg$currPos++;
            } else {
              s2 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c46);
              }
            }
          }
        } else {
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c47();
        }

        s0 = s1;
        return s0;
      }

      function peg$parsehalfMove() {
        var s0, s1, s2, s3, s4, s5, s6, s7, s8;
        s0 = peg$currPos;
        s1 = peg$parsefigure();

        if (s1 === peg$FAILED) {
          s1 = null;
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          s3 = peg$parsecheckdisc();
          peg$silentFails--;

          if (s3 !== peg$FAILED) {
            peg$currPos = s2;
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parsediscriminator();

            if (s3 !== peg$FAILED) {
              s4 = peg$parsestrike();

              if (s4 === peg$FAILED) {
                s4 = null;
              }

              if (s4 !== peg$FAILED) {
                s5 = peg$parsecolumn();

                if (s5 !== peg$FAILED) {
                  s6 = peg$parserow();

                  if (s6 !== peg$FAILED) {
                    s7 = peg$parsepromotion();

                    if (s7 === peg$FAILED) {
                      s7 = null;
                    }

                    if (s7 !== peg$FAILED) {
                      s8 = peg$parsecheck();

                      if (s8 === peg$FAILED) {
                        s8 = null;
                      }

                      if (s8 !== peg$FAILED) {
                        s1 = peg$c48(s1, s3, s4, s5, s6, s7, s8);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parsefigure();

          if (s1 === peg$FAILED) {
            s1 = null;
          }

          if (s1 !== peg$FAILED) {
            s2 = peg$parsecolumn();

            if (s2 !== peg$FAILED) {
              s3 = peg$parserow();

              if (s3 !== peg$FAILED) {
                s4 = peg$parsestrikeOrDash();

                if (s4 === peg$FAILED) {
                  s4 = null;
                }

                if (s4 !== peg$FAILED) {
                  s5 = peg$parsecolumn();

                  if (s5 !== peg$FAILED) {
                    s6 = peg$parserow();

                    if (s6 !== peg$FAILED) {
                      s7 = peg$parsepromotion();

                      if (s7 === peg$FAILED) {
                        s7 = null;
                      }

                      if (s7 !== peg$FAILED) {
                        s8 = peg$parsecheck();

                        if (s8 === peg$FAILED) {
                          s8 = null;
                        }

                        if (s8 !== peg$FAILED) {
                          s1 = peg$c49(s1, s2, s3, s4, s5, s6, s7, s8);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            s1 = peg$parsefigure();

            if (s1 === peg$FAILED) {
              s1 = null;
            }

            if (s1 !== peg$FAILED) {
              s2 = peg$parsestrike();

              if (s2 === peg$FAILED) {
                s2 = null;
              }

              if (s2 !== peg$FAILED) {
                s3 = peg$parsecolumn();

                if (s3 !== peg$FAILED) {
                  s4 = peg$parserow();

                  if (s4 !== peg$FAILED) {
                    s5 = peg$parsepromotion();

                    if (s5 === peg$FAILED) {
                      s5 = null;
                    }

                    if (s5 !== peg$FAILED) {
                      s6 = peg$parsecheck();

                      if (s6 === peg$FAILED) {
                        s6 = null;
                      }

                      if (s6 !== peg$FAILED) {
                        s1 = peg$c50(s1, s2, s3, s4, s5, s6);
                        s0 = s1;
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;

              if (input.substr(peg$currPos, 5) === peg$c51) {
                s1 = peg$c51;
                peg$currPos += 5;
              } else {
                s1 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c52);
                }
              }

              if (s1 !== peg$FAILED) {
                s2 = peg$parsecheck();

                if (s2 === peg$FAILED) {
                  s2 = null;
                }

                if (s2 !== peg$FAILED) {
                  s1 = peg$c53(s2);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }

              if (s0 === peg$FAILED) {
                s0 = peg$currPos;

                if (input.substr(peg$currPos, 3) === peg$c54) {
                  s1 = peg$c54;
                  peg$currPos += 3;
                } else {
                  s1 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c55);
                  }
                }

                if (s1 !== peg$FAILED) {
                  s2 = peg$parsecheck();

                  if (s2 === peg$FAILED) {
                    s2 = null;
                  }

                  if (s2 !== peg$FAILED) {
                    s1 = peg$c56(s2);
                    s0 = s1;
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parsecheck() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        peg$silentFails++;

        if (input.substr(peg$currPos, 2) === peg$c57) {
          s3 = peg$c57;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c58);
          }
        }

        peg$silentFails--;

        if (s3 === peg$FAILED) {
          s2 = void 0;
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }

        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 43) {
            s3 = peg$c59;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c60);
            }
          }

          if (s3 !== peg$FAILED) {
            s2 = [s2, s3];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }

        if (s1 !== peg$FAILED) {
          s1 = peg$c61(s1);
        }

        s0 = s1;

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$currPos;
          s2 = peg$currPos;
          peg$silentFails++;

          if (input.substr(peg$currPos, 3) === peg$c62) {
            s3 = peg$c62;
            peg$currPos += 3;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c63);
            }
          }

          peg$silentFails--;

          if (s3 === peg$FAILED) {
            s2 = void 0;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 35) {
              s3 = peg$c64;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c65);
              }
            }

            if (s3 !== peg$FAILED) {
              s2 = [s2, s3];
              s1 = s2;
            } else {
              peg$currPos = s1;
              s1 = peg$FAILED;
            }
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }

          if (s1 !== peg$FAILED) {
            s1 = peg$c61(s1);
          }

          s0 = s1;
        }

        return s0;
      }

      function peg$parsepromotion() {
        var s0, s1, s2;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 61) {
          s1 = peg$c66;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c67);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parsefigure();

          if (s2 !== peg$FAILED) {
            s1 = peg$c68(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsenags() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parsenag();

        if (s1 !== peg$FAILED) {
          s2 = peg$parsewhiteSpace();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parsenags();

            if (s3 === peg$FAILED) {
              s3 = null;
            }

            if (s3 !== peg$FAILED) {
              s1 = peg$c69(s1, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsenag() {
        var s0, s1, s2;
        s0 = peg$currPos;

        if (input.charCodeAt(peg$currPos) === 36) {
          s1 = peg$c70;
          peg$currPos++;
        } else {
          s1 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c71);
          }
        }

        if (s1 !== peg$FAILED) {
          s2 = peg$parseinteger();

          if (s2 !== peg$FAILED) {
            s1 = peg$c72(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        if (s0 === peg$FAILED) {
          s0 = peg$currPos;

          if (input.substr(peg$currPos, 2) === peg$c73) {
            s1 = peg$c73;
            peg$currPos += 2;
          } else {
            s1 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c74);
            }
          }

          if (s1 !== peg$FAILED) {
            s1 = peg$c75();
          }

          s0 = s1;

          if (s0 === peg$FAILED) {
            s0 = peg$currPos;

            if (input.substr(peg$currPos, 2) === peg$c76) {
              s1 = peg$c76;
              peg$currPos += 2;
            } else {
              s1 = peg$FAILED;

              if (peg$silentFails === 0) {
                peg$fail(peg$c77);
              }
            }

            if (s1 !== peg$FAILED) {
              s1 = peg$c78();
            }

            s0 = s1;

            if (s0 === peg$FAILED) {
              s0 = peg$currPos;

              if (input.substr(peg$currPos, 2) === peg$c79) {
                s1 = peg$c79;
                peg$currPos += 2;
              } else {
                s1 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c80);
                }
              }

              if (s1 !== peg$FAILED) {
                s1 = peg$c81();
              }

              s0 = s1;

              if (s0 === peg$FAILED) {
                s0 = peg$currPos;

                if (input.substr(peg$currPos, 2) === peg$c82) {
                  s1 = peg$c82;
                  peg$currPos += 2;
                } else {
                  s1 = peg$FAILED;

                  if (peg$silentFails === 0) {
                    peg$fail(peg$c83);
                  }
                }

                if (s1 !== peg$FAILED) {
                  s1 = peg$c84();
                }

                s0 = s1;

                if (s0 === peg$FAILED) {
                  s0 = peg$currPos;

                  if (input.charCodeAt(peg$currPos) === 33) {
                    s1 = peg$c85;
                    peg$currPos++;
                  } else {
                    s1 = peg$FAILED;

                    if (peg$silentFails === 0) {
                      peg$fail(peg$c86);
                    }
                  }

                  if (s1 !== peg$FAILED) {
                    s1 = peg$c87();
                  }

                  s0 = s1;

                  if (s0 === peg$FAILED) {
                    s0 = peg$currPos;

                    if (input.charCodeAt(peg$currPos) === 63) {
                      s1 = peg$c88;
                      peg$currPos++;
                    } else {
                      s1 = peg$FAILED;

                      if (peg$silentFails === 0) {
                        peg$fail(peg$c89);
                      }
                    }

                    if (s1 !== peg$FAILED) {
                      s1 = peg$c90();
                    }

                    s0 = s1;

                    if (s0 === peg$FAILED) {
                      s0 = peg$currPos;

                      if (input.charCodeAt(peg$currPos) === 8252) {
                        s1 = peg$c91;
                        peg$currPos++;
                      } else {
                        s1 = peg$FAILED;

                        if (peg$silentFails === 0) {
                          peg$fail(peg$c92);
                        }
                      }

                      if (s1 !== peg$FAILED) {
                        s1 = peg$c75();
                      }

                      s0 = s1;

                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;

                        if (input.charCodeAt(peg$currPos) === 8263) {
                          s1 = peg$c93;
                          peg$currPos++;
                        } else {
                          s1 = peg$FAILED;

                          if (peg$silentFails === 0) {
                            peg$fail(peg$c94);
                          }
                        }

                        if (s1 !== peg$FAILED) {
                          s1 = peg$c78();
                        }

                        s0 = s1;

                        if (s0 === peg$FAILED) {
                          s0 = peg$currPos;

                          if (input.charCodeAt(peg$currPos) === 8265) {
                            s1 = peg$c95;
                            peg$currPos++;
                          } else {
                            s1 = peg$FAILED;

                            if (peg$silentFails === 0) {
                              peg$fail(peg$c96);
                            }
                          }

                          if (s1 !== peg$FAILED) {
                            s1 = peg$c81();
                          }

                          s0 = s1;

                          if (s0 === peg$FAILED) {
                            s0 = peg$currPos;

                            if (input.charCodeAt(peg$currPos) === 8264) {
                              s1 = peg$c97;
                              peg$currPos++;
                            } else {
                              s1 = peg$FAILED;

                              if (peg$silentFails === 0) {
                                peg$fail(peg$c98);
                              }
                            }

                            if (s1 !== peg$FAILED) {
                              s1 = peg$c84();
                            }

                            s0 = s1;

                            if (s0 === peg$FAILED) {
                              s0 = peg$currPos;

                              if (input.charCodeAt(peg$currPos) === 9633) {
                                s1 = peg$c99;
                                peg$currPos++;
                              } else {
                                s1 = peg$FAILED;

                                if (peg$silentFails === 0) {
                                  peg$fail(peg$c100);
                                }
                              }

                              if (s1 !== peg$FAILED) {
                                s1 = peg$c101();
                              }

                              s0 = s1;

                              if (s0 === peg$FAILED) {
                                s0 = peg$currPos;

                                if (input.charCodeAt(peg$currPos) === 61) {
                                  s1 = peg$c66;
                                  peg$currPos++;
                                } else {
                                  s1 = peg$FAILED;

                                  if (peg$silentFails === 0) {
                                    peg$fail(peg$c67);
                                  }
                                }

                                if (s1 !== peg$FAILED) {
                                  s1 = peg$c102();
                                }

                                s0 = s1;

                                if (s0 === peg$FAILED) {
                                  s0 = peg$currPos;

                                  if (input.charCodeAt(peg$currPos) === 8734) {
                                    s1 = peg$c103;
                                    peg$currPos++;
                                  } else {
                                    s1 = peg$FAILED;

                                    if (peg$silentFails === 0) {
                                      peg$fail(peg$c104);
                                    }
                                  }

                                  if (s1 !== peg$FAILED) {
                                    s1 = peg$c105();
                                  }

                                  s0 = s1;

                                  if (s0 === peg$FAILED) {
                                    s0 = peg$currPos;

                                    if (input.charCodeAt(peg$currPos) === 10866) {
                                      s1 = peg$c106;
                                      peg$currPos++;
                                    } else {
                                      s1 = peg$FAILED;

                                      if (peg$silentFails === 0) {
                                        peg$fail(peg$c107);
                                      }
                                    }

                                    if (s1 !== peg$FAILED) {
                                      s1 = peg$c108();
                                    }

                                    s0 = s1;

                                    if (s0 === peg$FAILED) {
                                      s0 = peg$currPos;

                                      if (input.charCodeAt(peg$currPos) === 10865) {
                                        s1 = peg$c109;
                                        peg$currPos++;
                                      } else {
                                        s1 = peg$FAILED;

                                        if (peg$silentFails === 0) {
                                          peg$fail(peg$c110);
                                        }
                                      }

                                      if (s1 !== peg$FAILED) {
                                        s1 = peg$c111();
                                      }

                                      s0 = s1;

                                      if (s0 === peg$FAILED) {
                                        s0 = peg$currPos;

                                        if (input.charCodeAt(peg$currPos) === 177) {
                                          s1 = peg$c112;
                                          peg$currPos++;
                                        } else {
                                          s1 = peg$FAILED;

                                          if (peg$silentFails === 0) {
                                            peg$fail(peg$c113);
                                          }
                                        }

                                        if (s1 !== peg$FAILED) {
                                          s1 = peg$c114();
                                        }

                                        s0 = s1;

                                        if (s0 === peg$FAILED) {
                                          s0 = peg$currPos;

                                          if (input.charCodeAt(peg$currPos) === 8723) {
                                            s1 = peg$c115;
                                            peg$currPos++;
                                          } else {
                                            s1 = peg$FAILED;

                                            if (peg$silentFails === 0) {
                                              peg$fail(peg$c116);
                                            }
                                          }

                                          if (s1 !== peg$FAILED) {
                                            s1 = peg$c117();
                                          }

                                          s0 = s1;

                                          if (s0 === peg$FAILED) {
                                            s0 = peg$currPos;

                                            if (input.substr(peg$currPos, 2) === peg$c57) {
                                              s1 = peg$c57;
                                              peg$currPos += 2;
                                            } else {
                                              s1 = peg$FAILED;

                                              if (peg$silentFails === 0) {
                                                peg$fail(peg$c58);
                                              }
                                            }

                                            if (s1 !== peg$FAILED) {
                                              s1 = peg$c118();
                                            }

                                            s0 = s1;

                                            if (s0 === peg$FAILED) {
                                              s0 = peg$currPos;

                                              if (input.substr(peg$currPos, 2) === peg$c119) {
                                                s1 = peg$c119;
                                                peg$currPos += 2;
                                              } else {
                                                s1 = peg$FAILED;

                                                if (peg$silentFails === 0) {
                                                  peg$fail(peg$c120);
                                                }
                                              }

                                              if (s1 !== peg$FAILED) {
                                                s1 = peg$c121();
                                              }

                                              s0 = s1;

                                              if (s0 === peg$FAILED) {
                                                s0 = peg$currPos;

                                                if (input.charCodeAt(peg$currPos) === 10752) {
                                                  s1 = peg$c122;
                                                  peg$currPos++;
                                                } else {
                                                  s1 = peg$FAILED;

                                                  if (peg$silentFails === 0) {
                                                    peg$fail(peg$c123);
                                                  }
                                                }

                                                if (s1 !== peg$FAILED) {
                                                  s1 = peg$c124();
                                                }

                                                s0 = s1;

                                                if (s0 === peg$FAILED) {
                                                  s0 = peg$currPos;

                                                  if (input.charCodeAt(peg$currPos) === 10227) {
                                                    s1 = peg$c125;
                                                    peg$currPos++;
                                                  } else {
                                                    s1 = peg$FAILED;

                                                    if (peg$silentFails === 0) {
                                                      peg$fail(peg$c126);
                                                    }
                                                  }

                                                  if (s1 !== peg$FAILED) {
                                                    s1 = peg$c127();
                                                  }

                                                  s0 = s1;

                                                  if (s0 === peg$FAILED) {
                                                    s0 = peg$currPos;

                                                    if (input.charCodeAt(peg$currPos) === 8594) {
                                                      s1 = peg$c128;
                                                      peg$currPos++;
                                                    } else {
                                                      s1 = peg$FAILED;

                                                      if (peg$silentFails === 0) {
                                                        peg$fail(peg$c129);
                                                      }
                                                    }

                                                    if (s1 !== peg$FAILED) {
                                                      s1 = peg$c130();
                                                    }

                                                    s0 = s1;

                                                    if (s0 === peg$FAILED) {
                                                      s0 = peg$currPos;

                                                      if (input.charCodeAt(peg$currPos) === 8593) {
                                                        s1 = peg$c131;
                                                        peg$currPos++;
                                                      } else {
                                                        s1 = peg$FAILED;

                                                        if (peg$silentFails === 0) {
                                                          peg$fail(peg$c132);
                                                        }
                                                      }

                                                      if (s1 !== peg$FAILED) {
                                                        s1 = peg$c133();
                                                      }

                                                      s0 = s1;

                                                      if (s0 === peg$FAILED) {
                                                        s0 = peg$currPos;

                                                        if (input.charCodeAt(peg$currPos) === 8646) {
                                                          s1 = peg$c134;
                                                          peg$currPos++;
                                                        } else {
                                                          s1 = peg$FAILED;

                                                          if (peg$silentFails === 0) {
                                                            peg$fail(peg$c135);
                                                          }
                                                        }

                                                        if (s1 !== peg$FAILED) {
                                                          s1 = peg$c136();
                                                        }

                                                        s0 = s1;

                                                        if (s0 === peg$FAILED) {
                                                          s0 = peg$currPos;

                                                          if (input.charCodeAt(peg$currPos) === 68) {
                                                            s1 = peg$c137;
                                                            peg$currPos++;
                                                          } else {
                                                            s1 = peg$FAILED;

                                                            if (peg$silentFails === 0) {
                                                              peg$fail(peg$c138);
                                                            }
                                                          }

                                                          if (s1 !== peg$FAILED) {
                                                            s1 = peg$c139();
                                                          }

                                                          s0 = s1;
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        return s0;
      }

      function peg$parsediscriminator() {
        var s0;
        s0 = peg$parsecolumn();

        if (s0 === peg$FAILED) {
          s0 = peg$parserow();
        }

        return s0;
      }

      function peg$parsecheckdisc() {
        var s0, s1, s2, s3, s4;
        s0 = peg$currPos;
        s1 = peg$parsediscriminator();

        if (s1 !== peg$FAILED) {
          s2 = peg$parsestrike();

          if (s2 === peg$FAILED) {
            s2 = null;
          }

          if (s2 !== peg$FAILED) {
            s3 = peg$parsecolumn();

            if (s3 !== peg$FAILED) {
              s4 = peg$parserow();

              if (s4 !== peg$FAILED) {
                s1 = [s1, s2, s3, s4];
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsemoveEllipse() {
        var s0, s1, s2, s3;
        s0 = peg$currPos;
        s1 = peg$parseinteger();

        if (s1 !== peg$FAILED) {
          s2 = [];

          if (input.charCodeAt(peg$currPos) === 46) {
            s3 = peg$c38;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c39);
            }
          }

          if (s3 !== peg$FAILED) {
            while (s3 !== peg$FAILED) {
              s2.push(s3);

              if (input.charCodeAt(peg$currPos) === 46) {
                s3 = peg$c38;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;

                if (peg$silentFails === 0) {
                  peg$fail(peg$c39);
                }
              }
            }
          } else {
            s2 = peg$FAILED;
          }

          if (s2 !== peg$FAILED) {
            s1 = peg$c40(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }

        return s0;
      }

      function peg$parsefigure() {
        var s0;

        if (peg$c140.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c141);
          }
        }

        return s0;
      }

      function peg$parsecolumn() {
        var s0;

        if (peg$c142.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c143);
          }
        }

        return s0;
      }

      function peg$parserow() {
        var s0;

        if (peg$c144.test(input.charAt(peg$currPos))) {
          s0 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c145);
          }
        }

        return s0;
      }

      function peg$parsestrike() {
        var s0;

        if (input.charCodeAt(peg$currPos) === 120) {
          s0 = peg$c146;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c147);
          }
        }

        return s0;
      }

      function peg$parsestrikeOrDash() {
        var s0;

        if (input.charCodeAt(peg$currPos) === 120) {
          s0 = peg$c146;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;

          if (peg$silentFails === 0) {
            peg$fail(peg$c147);
          }
        }

        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 45) {
            s0 = peg$c148;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;

            if (peg$silentFails === 0) {
              peg$fail(peg$c149);
            }
          }
        }

        return s0;
      }

      function makeInteger(o) {
        return parseInt(o.join(""), 10);
      }

      peg$result = peg$startRuleFunction();

      if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
      } else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
          peg$fail(peg$endExpectation());
        }

        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
      }
    }
    /*
    module.exports = {
      SyntaxError: peg$SyntaxError,
      parse:       peg$parse
    };
    */


    class pgnParser {
      static parse(history, options) {
        return peg$parse(history, options);
      }

    }

    /*
     * Copyright (c) 2020, Jeff Hlywa (jhlywa@gmail.com)
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice,
     *    this list of conditions and the following disclaimer.
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution.
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
     * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
     * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
     * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
     * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
     * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
     * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
     * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
     * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
     * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
     * POSSIBILITY OF SUCH DAMAGE.
     *
     *----------------------------------------------------------------------------*/

    /* minified license below  */

    /* @license
     * Copyright (c) 2018, Jeff Hlywa (jhlywa@gmail.com)
     * Released under the BSD license
     * https://github.com/jhlywa/chess.js/blob/master/LICENSE
     */
    var Chess$1 = function (fen) {
      var BLACK = 'b';
      var WHITE = 'w';
      var EMPTY = -1;
      var PAWN = 'p';
      var KNIGHT = 'n';
      var BISHOP = 'b';
      var ROOK = 'r';
      var QUEEN = 'q';
      var KING = 'k';
      var SYMBOLS = 'pnbrqkPNBRQK';
      var DEFAULT_POSITION = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      var POSSIBLE_RESULTS = ['1-0', '0-1', '1/2-1/2', '*'];
      var PAWN_OFFSETS = {
        b: [16, 32, 17, 15],
        w: [-16, -32, -17, -15]
      };
      var PIECE_OFFSETS = {
        n: [-18, -33, -31, -14, 18, 33, 31, 14],
        b: [-17, -15, 17, 15],
        r: [-16, 1, 16, -1],
        q: [-17, -16, -15, 1, 17, 16, 15, -1],
        k: [-17, -16, -15, 1, 17, 16, 15, -1]
      }; // prettier-ignore

      var ATTACKS = [20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20]; // prettier-ignore

      var RAYS = [17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0, 0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0, 0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0, -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17];
      var SHIFTS = {
        p: 0,
        n: 1,
        b: 2,
        r: 3,
        q: 4,
        k: 5
      };
      var FLAGS = {
        NORMAL: 'n',
        CAPTURE: 'c',
        BIG_PAWN: 'b',
        EP_CAPTURE: 'e',
        PROMOTION: 'p',
        KSIDE_CASTLE: 'k',
        QSIDE_CASTLE: 'q'
      };
      var BITS = {
        NORMAL: 1,
        CAPTURE: 2,
        BIG_PAWN: 4,
        EP_CAPTURE: 8,
        PROMOTION: 16,
        KSIDE_CASTLE: 32,
        QSIDE_CASTLE: 64
      };
      var RANK_1 = 7;
      var RANK_2 = 6;
      var RANK_7 = 1;
      var RANK_8 = 0; // prettier-ignore

      var SQUARES = {
        a8: 0,
        b8: 1,
        c8: 2,
        d8: 3,
        e8: 4,
        f8: 5,
        g8: 6,
        h8: 7,
        a7: 16,
        b7: 17,
        c7: 18,
        d7: 19,
        e7: 20,
        f7: 21,
        g7: 22,
        h7: 23,
        a6: 32,
        b6: 33,
        c6: 34,
        d6: 35,
        e6: 36,
        f6: 37,
        g6: 38,
        h6: 39,
        a5: 48,
        b5: 49,
        c5: 50,
        d5: 51,
        e5: 52,
        f5: 53,
        g5: 54,
        h5: 55,
        a4: 64,
        b4: 65,
        c4: 66,
        d4: 67,
        e4: 68,
        f4: 69,
        g4: 70,
        h4: 71,
        a3: 80,
        b3: 81,
        c3: 82,
        d3: 83,
        e3: 84,
        f3: 85,
        g3: 86,
        h3: 87,
        a2: 96,
        b2: 97,
        c2: 98,
        d2: 99,
        e2: 100,
        f2: 101,
        g2: 102,
        h2: 103,
        a1: 112,
        b1: 113,
        c1: 114,
        d1: 115,
        e1: 116,
        f1: 117,
        g1: 118,
        h1: 119
      };
      var ROOKS = {
        w: [{
          square: SQUARES.a1,
          flag: BITS.QSIDE_CASTLE
        }, {
          square: SQUARES.h1,
          flag: BITS.KSIDE_CASTLE
        }],
        b: [{
          square: SQUARES.a8,
          flag: BITS.QSIDE_CASTLE
        }, {
          square: SQUARES.h8,
          flag: BITS.KSIDE_CASTLE
        }]
      };
      var board = new Array(128);
      var kings = {
        w: EMPTY,
        b: EMPTY
      };
      var turn = WHITE;
      var castling = {
        w: 0,
        b: 0
      };
      var ep_square = EMPTY;
      var half_moves = 0;
      var move_number = 1;
      var history = [];
      var header = {};
      /* if the user passes in a fen string, load it, else default to
       * starting position
       */

      if (typeof fen === 'undefined') {
        load(DEFAULT_POSITION);
      } else {
        load(fen);
      }

      function clear(keep_headers) {
        if (typeof keep_headers === 'undefined') {
          keep_headers = false;
        }

        board = new Array(128);
        kings = {
          w: EMPTY,
          b: EMPTY
        };
        turn = WHITE;
        castling = {
          w: 0,
          b: 0
        };
        ep_square = EMPTY;
        half_moves = 0;
        move_number = 1;
        history = [];
        if (!keep_headers) header = {};
        update_setup(generate_fen());
      }

      function reset() {
        load(DEFAULT_POSITION);
      }

      function load(fen, keep_headers) {
        if (typeof keep_headers === 'undefined') {
          keep_headers = false;
        }

        var tokens = fen.split(/\s+/);
        var position = tokens[0];
        var square = 0;

        if (!validate_fen(fen).valid) {
          return false;
        }

        clear(keep_headers);

        for (var i = 0; i < position.length; i++) {
          var piece = position.charAt(i);

          if (piece === '/') {
            square += 8;
          } else if (is_digit(piece)) {
            square += parseInt(piece, 10);
          } else {
            var color = piece < 'a' ? WHITE : BLACK;
            put({
              type: piece.toLowerCase(),
              color: color
            }, algebraic(square));
            square++;
          }
        }

        turn = tokens[1];

        if (tokens[2].indexOf('K') > -1) {
          castling.w |= BITS.KSIDE_CASTLE;
        }

        if (tokens[2].indexOf('Q') > -1) {
          castling.w |= BITS.QSIDE_CASTLE;
        }

        if (tokens[2].indexOf('k') > -1) {
          castling.b |= BITS.KSIDE_CASTLE;
        }

        if (tokens[2].indexOf('q') > -1) {
          castling.b |= BITS.QSIDE_CASTLE;
        }

        ep_square = tokens[3] === '-' ? EMPTY : SQUARES[tokens[3]];
        half_moves = parseInt(tokens[4], 10);
        move_number = parseInt(tokens[5], 10);
        update_setup(generate_fen());
        return true;
      }
      /* TODO: this function is pretty much crap - it validates structure but
       * completely ignores content (e.g. doesn't verify that each side has a king)
       * ... we should rewrite this, and ditch the silly error_number field while
       * we're at it
       */


      function validate_fen(fen) {
        var errors = {
          0: 'No errors.',
          1: 'FEN string must contain six space-delimited fields.',
          2: '6th field (move number) must be a positive integer.',
          3: '5th field (half move counter) must be a non-negative integer.',
          4: '4th field (en-passant square) is invalid.',
          5: '3rd field (castling availability) is invalid.',
          6: '2nd field (side to move) is invalid.',
          7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
          8: '1st field (piece positions) is invalid [consecutive numbers].',
          9: '1st field (piece positions) is invalid [invalid piece].',
          10: '1st field (piece positions) is invalid [row too large].',
          11: 'Illegal en-passant square'
        };
        /* 1st criterion: 6 space-seperated fields? */

        var tokens = fen.split(/\s+/);

        if (tokens.length !== 6) {
          return {
            valid: false,
            error_number: 1,
            error: errors[1]
          };
        }
        /* 2nd criterion: move number field is a integer value > 0? */


        if (isNaN(tokens[5]) || parseInt(tokens[5], 10) <= 0) {
          return {
            valid: false,
            error_number: 2,
            error: errors[2]
          };
        }
        /* 3rd criterion: half move counter is an integer >= 0? */


        if (isNaN(tokens[4]) || parseInt(tokens[4], 10) < 0) {
          return {
            valid: false,
            error_number: 3,
            error: errors[3]
          };
        }
        /* 4th criterion: 4th field is a valid e.p.-string? */


        if (!/^(-|[abcdefgh][36])$/.test(tokens[3])) {
          return {
            valid: false,
            error_number: 4,
            error: errors[4]
          };
        }
        /* 5th criterion: 3th field is a valid castle-string? */


        if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(tokens[2])) {
          return {
            valid: false,
            error_number: 5,
            error: errors[5]
          };
        }
        /* 6th criterion: 2nd field is "w" (white) or "b" (black)? */


        if (!/^(w|b)$/.test(tokens[1])) {
          return {
            valid: false,
            error_number: 6,
            error: errors[6]
          };
        }
        /* 7th criterion: 1st field contains 8 rows? */


        var rows = tokens[0].split('/');

        if (rows.length !== 8) {
          return {
            valid: false,
            error_number: 7,
            error: errors[7]
          };
        }
        /* 8th criterion: every row is valid? */


        for (var i = 0; i < rows.length; i++) {
          /* check for right sum of fields AND not two numbers in succession */
          var sum_fields = 0;
          var previous_was_number = false;

          for (var k = 0; k < rows[i].length; k++) {
            if (!isNaN(rows[i][k])) {
              if (previous_was_number) {
                return {
                  valid: false,
                  error_number: 8,
                  error: errors[8]
                };
              }

              sum_fields += parseInt(rows[i][k], 10);
              previous_was_number = true;
            } else {
              if (!/^[prnbqkPRNBQK]$/.test(rows[i][k])) {
                return {
                  valid: false,
                  error_number: 9,
                  error: errors[9]
                };
              }

              sum_fields += 1;
              previous_was_number = false;
            }
          }

          if (sum_fields !== 8) {
            return {
              valid: false,
              error_number: 10,
              error: errors[10]
            };
          }
        }

        if (tokens[3][1] == '3' && tokens[1] == 'w' || tokens[3][1] == '6' && tokens[1] == 'b') {
          return {
            valid: false,
            error_number: 11,
            error: errors[11]
          };
        }
        /* everything's okay! */


        return {
          valid: true,
          error_number: 0,
          error: errors[0]
        };
      }

      function generate_fen() {
        var empty = 0;
        var fen = '';

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          if (board[i] == null) {
            empty++;
          } else {
            if (empty > 0) {
              fen += empty;
              empty = 0;
            }

            var color = board[i].color;
            var piece = board[i].type;
            fen += color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
          }

          if (i + 1 & 0x88) {
            if (empty > 0) {
              fen += empty;
            }

            if (i !== SQUARES.h1) {
              fen += '/';
            }

            empty = 0;
            i += 8;
          }
        }

        var cflags = '';

        if (castling[WHITE] & BITS.KSIDE_CASTLE) {
          cflags += 'K';
        }

        if (castling[WHITE] & BITS.QSIDE_CASTLE) {
          cflags += 'Q';
        }

        if (castling[BLACK] & BITS.KSIDE_CASTLE) {
          cflags += 'k';
        }

        if (castling[BLACK] & BITS.QSIDE_CASTLE) {
          cflags += 'q';
        }
        /* do we have an empty castling flag? */


        cflags = cflags || '-';
        var epflags = ep_square === EMPTY ? '-' : algebraic(ep_square);
        return [fen, turn, cflags, epflags, half_moves, move_number].join(' ');
      }

      function set_header(args) {
        for (var i = 0; i < args.length; i += 2) {
          if (typeof args[i] === 'string' && typeof args[i + 1] === 'string') {
            header[args[i]] = args[i + 1];
          }
        }

        return header;
      }
      /* called when the initial board setup is changed with put() or remove().
       * modifies the SetUp and FEN properties of the header object.  if the FEN is
       * equal to the default position, the SetUp and FEN are deleted
       * the setup is only updated if history.length is zero, ie moves haven't been
       * made.
       */


      function update_setup(fen) {
        if (history.length > 0) return;

        if (fen !== DEFAULT_POSITION) {
          header['SetUp'] = '1';
          header['FEN'] = fen;
        } else {
          delete header['SetUp'];
          delete header['FEN'];
        }
      }

      function get(square) {
        var piece = board[SQUARES[square]];
        return piece ? {
          type: piece.type,
          color: piece.color
        } : null;
      }

      function put(piece, square) {
        /* check for valid piece object */
        if (!('type' in piece && 'color' in piece)) {
          return false;
        }
        /* check for piece */


        if (SYMBOLS.indexOf(piece.type.toLowerCase()) === -1) {
          return false;
        }
        /* check for valid square */


        if (!(square in SQUARES)) {
          return false;
        }

        var sq = SQUARES[square];
        /* don't let the user place more than one king */

        if (piece.type == KING && !(kings[piece.color] == EMPTY || kings[piece.color] == sq)) {
          return false;
        }

        board[sq] = {
          type: piece.type,
          color: piece.color
        };

        if (piece.type === KING) {
          kings[piece.color] = sq;
        }

        update_setup(generate_fen());
        return true;
      }

      function remove(square) {
        var piece = get(square);
        board[SQUARES[square]] = null;

        if (piece && piece.type === KING) {
          kings[piece.color] = EMPTY;
        }

        update_setup(generate_fen());
        return piece;
      }

      function build_move(board, from, to, flags, promotion) {
        var move = {
          color: turn,
          from: from,
          to: to,
          flags: flags,
          piece: board[from].type
        };

        if (promotion) {
          move.flags |= BITS.PROMOTION;
          move.promotion = promotion;
        }

        if (board[to]) {
          move.captured = board[to].type;
        } else if (flags & BITS.EP_CAPTURE) {
          move.captured = PAWN;
        }

        return move;
      }

      function generate_moves(options) {
        function add_move(board, moves, from, to, flags) {
          /* if pawn promotion */
          if (board[from].type === PAWN && (rank(to) === RANK_8 || rank(to) === RANK_1)) {
            var pieces = [QUEEN, ROOK, BISHOP, KNIGHT];

            for (var i = 0, len = pieces.length; i < len; i++) {
              moves.push(build_move(board, from, to, flags, pieces[i]));
            }
          } else {
            moves.push(build_move(board, from, to, flags));
          }
        }

        var moves = [];
        var us = turn;
        var them = swap_color(us);
        var second_rank = {
          b: RANK_7,
          w: RANK_2
        };
        var first_sq = SQUARES.a8;
        var last_sq = SQUARES.h1;
        var single_square = false;
        /* do we want legal moves? */

        var legal = typeof options !== 'undefined' && 'legal' in options ? options.legal : true;
        /* are we generating moves for a single square? */

        if (typeof options !== 'undefined' && 'square' in options) {
          if (options.square in SQUARES) {
            first_sq = last_sq = SQUARES[options.square];
            single_square = true;
          } else {
            /* invalid square */
            return [];
          }
        }

        for (var i = first_sq; i <= last_sq; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) {
            i += 7;
            continue;
          }

          var piece = board[i];

          if (piece == null || piece.color !== us) {
            continue;
          }

          if (piece.type === PAWN) {
            /* single square, non-capturing */
            var square = i + PAWN_OFFSETS[us][0];

            if (board[square] == null) {
              add_move(board, moves, i, square, BITS.NORMAL);
              /* double square */

              var square = i + PAWN_OFFSETS[us][1];

              if (second_rank[us] === rank(i) && board[square] == null) {
                add_move(board, moves, i, square, BITS.BIG_PAWN);
              }
            }
            /* pawn captures */


            for (j = 2; j < 4; j++) {
              var square = i + PAWN_OFFSETS[us][j];
              if (square & 0x88) continue;

              if (board[square] != null && board[square].color === them) {
                add_move(board, moves, i, square, BITS.CAPTURE);
              } else if (square === ep_square) {
                add_move(board, moves, i, ep_square, BITS.EP_CAPTURE);
              }
            }
          } else {
            for (var j = 0, len = PIECE_OFFSETS[piece.type].length; j < len; j++) {
              var offset = PIECE_OFFSETS[piece.type][j];
              var square = i;

              while (true) {
                square += offset;
                if (square & 0x88) break;

                if (board[square] == null) {
                  add_move(board, moves, i, square, BITS.NORMAL);
                } else {
                  if (board[square].color === us) break;
                  add_move(board, moves, i, square, BITS.CAPTURE);
                  break;
                }
                /* break, if knight or king */


                if (piece.type === 'n' || piece.type === 'k') break;
              }
            }
          }
        }
        /* check for castling if: a) we're generating all moves, or b) we're doing
         * single square move generation on the king's square
         */


        if (!single_square || last_sq === kings[us]) {
          /* king-side castling */
          if (castling[us] & BITS.KSIDE_CASTLE) {
            var castling_from = kings[us];
            var castling_to = castling_from + 2;

            if (board[castling_from + 1] == null && board[castling_to] == null && !attacked(them, kings[us]) && !attacked(them, castling_from + 1) && !attacked(them, castling_to)) {
              add_move(board, moves, kings[us], castling_to, BITS.KSIDE_CASTLE);
            }
          }
          /* queen-side castling */


          if (castling[us] & BITS.QSIDE_CASTLE) {
            var castling_from = kings[us];
            var castling_to = castling_from - 2;

            if (board[castling_from - 1] == null && board[castling_from - 2] == null && board[castling_from - 3] == null && !attacked(them, kings[us]) && !attacked(them, castling_from - 1) && !attacked(them, castling_to)) {
              add_move(board, moves, kings[us], castling_to, BITS.QSIDE_CASTLE);
            }
          }
        }
        /* return all pseudo-legal moves (this includes moves that allow the king
         * to be captured)
         */


        if (!legal) {
          return moves;
        }
        /* filter out illegal moves */


        var legal_moves = [];

        for (var i = 0, len = moves.length; i < len; i++) {
          make_move(moves[i]);

          if (!king_attacked(us)) {
            legal_moves.push(moves[i]);
          }

          undo_move();
        }

        return legal_moves;
      }
      /* convert a move from 0x88 coordinates to Standard Algebraic Notation
       * (SAN)
       *
       * @param {boolean} sloppy Use the sloppy SAN generator to work around over
       * disambiguation bugs in Fritz and Chessbase.  See below:
       *
       * r1bqkbnr/ppp2ppp/2n5/1B1pP3/4P3/8/PPPP2PP/RNBQK1NR b KQkq - 2 4
       * 4. ... Nge7 is overly disambiguated because the knight on c6 is pinned
       * 4. ... Ne7 is technically the valid SAN
       */


      function move_to_san(move, sloppy) {
        var output = '';

        if (move.flags & BITS.KSIDE_CASTLE) {
          output = 'O-O';
        } else if (move.flags & BITS.QSIDE_CASTLE) {
          output = 'O-O-O';
        } else {
          var disambiguator = get_disambiguator(move, sloppy);

          if (move.piece !== PAWN) {
            output += move.piece.toUpperCase() + disambiguator;
          }

          if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
            if (move.piece === PAWN) {
              output += algebraic(move.from)[0];
            }

            output += 'x';
          }

          output += algebraic(move.to);

          if (move.flags & BITS.PROMOTION) {
            output += '=' + move.promotion.toUpperCase();
          }
        }

        make_move(move);

        if (in_check()) {
          if (in_checkmate()) {
            output += '#';
          } else {
            output += '+';
          }
        }

        undo_move();
        return output;
      } // parses all of the decorators out of a SAN string


      function stripped_san(move) {
        return move.replace(/=/, '').replace(/[+#]?[?!]*$/, '');
      }

      function attacked(color, square) {
        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* did we run off the end of the board */
          if (i & 0x88) {
            i += 7;
            continue;
          }
          /* if empty square or wrong color */


          if (board[i] == null || board[i].color !== color) continue;
          var piece = board[i];
          var difference = i - square;
          var index = difference + 119;

          if (ATTACKS[index] & 1 << SHIFTS[piece.type]) {
            if (piece.type === PAWN) {
              if (difference > 0) {
                if (piece.color === WHITE) return true;
              } else {
                if (piece.color === BLACK) return true;
              }

              continue;
            }
            /* if the piece is a knight or a king */


            if (piece.type === 'n' || piece.type === 'k') return true;
            var offset = RAYS[index];
            var j = i + offset;
            var blocked = false;

            while (j !== square) {
              if (board[j] != null) {
                blocked = true;
                break;
              }

              j += offset;
            }

            if (!blocked) return true;
          }
        }

        return false;
      }

      function king_attacked(color) {
        return attacked(swap_color(color), kings[color]);
      }

      function in_check() {
        return king_attacked(turn);
      }

      function in_checkmate() {
        return in_check() && generate_moves().length === 0;
      }

      function in_stalemate() {
        return !in_check() && generate_moves().length === 0;
      }

      function insufficient_material() {
        var pieces = {};
        var bishops = [];
        var num_pieces = 0;
        var sq_color = 0;

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          sq_color = (sq_color + 1) % 2;

          if (i & 0x88) {
            i += 7;
            continue;
          }

          var piece = board[i];

          if (piece) {
            pieces[piece.type] = piece.type in pieces ? pieces[piece.type] + 1 : 1;

            if (piece.type === BISHOP) {
              bishops.push(sq_color);
            }

            num_pieces++;
          }
        }
        /* k vs. k */


        if (num_pieces === 2) {
          return true;
        } else if (
        /* k vs. kn .... or .... k vs. kb */
        num_pieces === 3 && (pieces[BISHOP] === 1 || pieces[KNIGHT] === 1)) {
          return true;
        } else if (num_pieces === pieces[BISHOP] + 2) {
          /* kb vs. kb where any number of bishops are all on the same color */
          var sum = 0;
          var len = bishops.length;

          for (var i = 0; i < len; i++) {
            sum += bishops[i];
          }

          if (sum === 0 || sum === len) {
            return true;
          }
        }

        return false;
      }

      function in_threefold_repetition() {
        /* TODO: while this function is fine for casual use, a better
         * implementation would use a Zobrist key (instead of FEN). the
         * Zobrist key would be maintained in the make_move/undo_move functions,
         * avoiding the costly that we do below.
         */
        var moves = [];
        var positions = {};
        var repetition = false;

        while (true) {
          var move = undo_move();
          if (!move) break;
          moves.push(move);
        }

        while (true) {
          /* remove the last two fields in the FEN string, they're not needed
           * when checking for draw by rep */
          var fen = generate_fen().split(' ').slice(0, 4).join(' ');
          /* has the position occurred three or move times */

          positions[fen] = fen in positions ? positions[fen] + 1 : 1;

          if (positions[fen] >= 3) {
            repetition = true;
          }

          if (!moves.length) {
            break;
          }

          make_move(moves.pop());
        }

        return repetition;
      }

      function push(move) {
        history.push({
          move: move,
          kings: {
            b: kings.b,
            w: kings.w
          },
          turn: turn,
          castling: {
            b: castling.b,
            w: castling.w
          },
          ep_square: ep_square,
          half_moves: half_moves,
          move_number: move_number
        });
      }

      function make_move(move) {
        var us = turn;
        var them = swap_color(us);
        push(move);
        board[move.to] = board[move.from];
        board[move.from] = null;
        /* if ep capture, remove the captured pawn */

        if (move.flags & BITS.EP_CAPTURE) {
          if (turn === BLACK) {
            board[move.to - 16] = null;
          } else {
            board[move.to + 16] = null;
          }
        }
        /* if pawn promotion, replace with new piece */


        if (move.flags & BITS.PROMOTION) {
          board[move.to] = {
            type: move.promotion,
            color: us
          };
        }
        /* if we moved the king */


        if (board[move.to].type === KING) {
          kings[board[move.to].color] = move.to;
          /* if we castled, move the rook next to the king */

          if (move.flags & BITS.KSIDE_CASTLE) {
            var castling_to = move.to - 1;
            var castling_from = move.to + 1;
            board[castling_to] = board[castling_from];
            board[castling_from] = null;
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            var castling_to = move.to + 1;
            var castling_from = move.to - 2;
            board[castling_to] = board[castling_from];
            board[castling_from] = null;
          }
          /* turn off castling */


          castling[us] = '';
        }
        /* turn off castling if we move a rook */


        if (castling[us]) {
          for (var i = 0, len = ROOKS[us].length; i < len; i++) {
            if (move.from === ROOKS[us][i].square && castling[us] & ROOKS[us][i].flag) {
              castling[us] ^= ROOKS[us][i].flag;
              break;
            }
          }
        }
        /* turn off castling if we capture a rook */


        if (castling[them]) {
          for (var i = 0, len = ROOKS[them].length; i < len; i++) {
            if (move.to === ROOKS[them][i].square && castling[them] & ROOKS[them][i].flag) {
              castling[them] ^= ROOKS[them][i].flag;
              break;
            }
          }
        }
        /* if big pawn move, update the en passant square */


        if (move.flags & BITS.BIG_PAWN) {
          if (turn === 'b') {
            ep_square = move.to - 16;
          } else {
            ep_square = move.to + 16;
          }
        } else {
          ep_square = EMPTY;
        }
        /* reset the 50 move counter if a pawn is moved or a piece is captured */


        if (move.piece === PAWN) {
          half_moves = 0;
        } else if (move.flags & (BITS.CAPTURE | BITS.EP_CAPTURE)) {
          half_moves = 0;
        } else {
          half_moves++;
        }

        if (turn === BLACK) {
          move_number++;
        }

        turn = swap_color(turn);
      }

      function undo_move() {
        var old = history.pop();

        if (old == null) {
          return null;
        }

        var move = old.move;
        kings = old.kings;
        turn = old.turn;
        castling = old.castling;
        ep_square = old.ep_square;
        half_moves = old.half_moves;
        move_number = old.move_number;
        var us = turn;
        var them = swap_color(turn);
        board[move.from] = board[move.to];
        board[move.from].type = move.piece; // to undo any promotions

        board[move.to] = null;

        if (move.flags & BITS.CAPTURE) {
          board[move.to] = {
            type: move.captured,
            color: them
          };
        } else if (move.flags & BITS.EP_CAPTURE) {
          var index;

          if (us === BLACK) {
            index = move.to - 16;
          } else {
            index = move.to + 16;
          }

          board[index] = {
            type: PAWN,
            color: them
          };
        }

        if (move.flags & (BITS.KSIDE_CASTLE | BITS.QSIDE_CASTLE)) {
          var castling_to, castling_from;

          if (move.flags & BITS.KSIDE_CASTLE) {
            castling_to = move.to + 1;
            castling_from = move.to - 1;
          } else if (move.flags & BITS.QSIDE_CASTLE) {
            castling_to = move.to - 2;
            castling_from = move.to + 1;
          }

          board[castling_to] = board[castling_from];
          board[castling_from] = null;
        }

        return move;
      }
      /* this function is used to uniquely identify ambiguous moves */


      function get_disambiguator(move, sloppy) {
        var moves = generate_moves({
          legal: !sloppy
        });
        var from = move.from;
        var to = move.to;
        var piece = move.piece;
        var ambiguities = 0;
        var same_rank = 0;
        var same_file = 0;

        for (var i = 0, len = moves.length; i < len; i++) {
          var ambig_from = moves[i].from;
          var ambig_to = moves[i].to;
          var ambig_piece = moves[i].piece;
          /* if a move of the same piece type ends on the same to square, we'll
           * need to add a disambiguator to the algebraic notation
           */

          if (piece === ambig_piece && from !== ambig_from && to === ambig_to) {
            ambiguities++;

            if (rank(from) === rank(ambig_from)) {
              same_rank++;
            }

            if (file(from) === file(ambig_from)) {
              same_file++;
            }
          }
        }

        if (ambiguities > 0) {
          /* if there exists a similar moving piece on the same rank and file as
           * the move in question, use the square as the disambiguator
           */
          if (same_rank > 0 && same_file > 0) {
            return algebraic(from);
          } else if (same_file > 0) {
            /* if the moving piece rests on the same file, use the rank symbol as the
             * disambiguator
             */
            return algebraic(from).charAt(1);
          } else {
            /* else use the file symbol */
            return algebraic(from).charAt(0);
          }
        }

        return '';
      }

      function ascii() {
        var s = '   +------------------------+\n';

        for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
          /* display the rank */
          if (file(i) === 0) {
            s += ' ' + '87654321'[rank(i)] + ' |';
          }
          /* empty piece */


          if (board[i] == null) {
            s += ' . ';
          } else {
            var piece = board[i].type;
            var color = board[i].color;
            var symbol = color === WHITE ? piece.toUpperCase() : piece.toLowerCase();
            s += ' ' + symbol + ' ';
          }

          if (i + 1 & 0x88) {
            s += '|\n';
            i += 8;
          }
        }

        s += '   +------------------------+\n';
        s += '     a  b  c  d  e  f  g  h\n';
        return s;
      } // convert a move from Standard Algebraic Notation (SAN) to 0x88 coordinates


      function move_from_san(move, sloppy) {
        // strip off any move decorations: e.g Nf3+?!
        var clean_move = stripped_san(move); // if we're using the sloppy parser run a regex to grab piece, to, and from
        // this should parse invalid SAN like: Pe2-e4, Rc1c4, Qf3xf7

        if (sloppy) {
          var matches = clean_move.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/);

          if (matches) {
            var piece = matches[1];
            var from = matches[2];
            var to = matches[3];
            var promotion = matches[4];
          }
        }

        var moves = generate_moves();

        for (var i = 0, len = moves.length; i < len; i++) {
          // try the strict parser first, then the sloppy parser if requested
          // by the user
          if (clean_move === stripped_san(move_to_san(moves[i])) || sloppy && clean_move === stripped_san(move_to_san(moves[i], true))) {
            return moves[i];
          } else {
            if (matches && (!piece || piece.toLowerCase() == moves[i].piece) && SQUARES[from] == moves[i].from && SQUARES[to] == moves[i].to && (!promotion || promotion.toLowerCase() == moves[i].promotion)) {
              return moves[i];
            }
          }
        }

        return null;
      }
      /*****************************************************************************
       * UTILITY FUNCTIONS
       ****************************************************************************/


      function rank(i) {
        return i >> 4;
      }

      function file(i) {
        return i & 15;
      }

      function algebraic(i) {
        var f = file(i),
            r = rank(i);
        return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1);
      }

      function swap_color(c) {
        return c === WHITE ? BLACK : WHITE;
      }

      function is_digit(c) {
        return '0123456789'.indexOf(c) !== -1;
      }
      /* pretty = external move object */


      function make_pretty(ugly_move) {
        var move = clone(ugly_move);
        move.san = move_to_san(move, false);
        move.to = algebraic(move.to);
        move.from = algebraic(move.from);
        var flags = '';

        for (var flag in BITS) {
          if (BITS[flag] & move.flags) {
            flags += FLAGS[flag];
          }
        }

        move.flags = flags;
        return move;
      }

      function clone(obj) {
        var dupe = obj instanceof Array ? [] : {};

        for (var property in obj) {
          if (typeof property === 'object') {
            dupe[property] = clone(obj[property]);
          } else {
            dupe[property] = obj[property];
          }
        }

        return dupe;
      }

      function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
      }
      /*****************************************************************************
       * DEBUGGING UTILITIES
       ****************************************************************************/


      function perft(depth) {
        var moves = generate_moves({
          legal: false
        });
        var nodes = 0;
        var color = turn;

        for (var i = 0, len = moves.length; i < len; i++) {
          make_move(moves[i]);

          if (!king_attacked(color)) {
            if (depth - 1 > 0) {
              var child_nodes = perft(depth - 1);
              nodes += child_nodes;
            } else {
              nodes++;
            }
          }

          undo_move();
        }

        return nodes;
      }

      return {
        /***************************************************************************
         * PUBLIC CONSTANTS (is there a better way to do this?)
         **************************************************************************/
        WHITE: WHITE,
        BLACK: BLACK,
        PAWN: PAWN,
        KNIGHT: KNIGHT,
        BISHOP: BISHOP,
        ROOK: ROOK,
        QUEEN: QUEEN,
        KING: KING,
        SQUARES: function () {
          /* from the ECMA-262 spec (section 12.6.4):
           * "The mechanics of enumerating the properties ... is
           * implementation dependent"
           * so: for (var sq in SQUARES) { keys.push(sq); } might not be
           * ordered correctly
           */
          var keys = [];

          for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (i & 0x88) {
              i += 7;
              continue;
            }

            keys.push(algebraic(i));
          }

          return keys;
        }(),
        FLAGS: FLAGS,

        /***************************************************************************
         * PUBLIC API
         **************************************************************************/
        load: function (fen) {
          return load(fen);
        },
        reset: function () {
          return reset();
        },
        moves: function (options) {
          /* The internal representation of a chess move is in 0x88 format, and
           * not meant to be human-readable.  The code below converts the 0x88
           * square coordinates to algebraic coordinates.  It also prunes an
           * unnecessary move keys resulting from a verbose call.
           */
          var ugly_moves = generate_moves(options);
          var moves = [];

          for (var i = 0, len = ugly_moves.length; i < len; i++) {
            /* does the user want a full move object (most likely not), or just
             * SAN
             */
            if (typeof options !== 'undefined' && 'verbose' in options && options.verbose) {
              moves.push(make_pretty(ugly_moves[i]));
            } else {
              moves.push(move_to_san(ugly_moves[i], false));
            }
          }

          return moves;
        },
        in_check: function () {
          return in_check();
        },
        in_checkmate: function () {
          return in_checkmate();
        },
        in_stalemate: function () {
          return in_stalemate();
        },
        in_draw: function () {
          return half_moves >= 100 || in_stalemate() || insufficient_material() || in_threefold_repetition();
        },
        insufficient_material: function () {
          return insufficient_material();
        },
        in_threefold_repetition: function () {
          return in_threefold_repetition();
        },
        game_over: function () {
          return half_moves >= 100 || in_checkmate() || in_stalemate() || insufficient_material() || in_threefold_repetition();
        },
        validate_fen: function (fen) {
          return validate_fen(fen);
        },
        fen: function () {
          return generate_fen();
        },
        board: function () {
          var output = [],
              row = [];

          for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
            if (board[i] == null) {
              row.push(null);
            } else {
              row.push({
                type: board[i].type,
                color: board[i].color
              });
            }

            if (i + 1 & 0x88) {
              output.push(row);
              row = [];
              i += 8;
            }
          }

          return output;
        },
        pgn: function (options) {
          /* using the specification from http://www.chessclub.com/help/PGN-spec
           * example for html usage: .pgn({ max_width: 72, newline_char: "<br />" })
           */
          var newline = typeof options === 'object' && typeof options.newline_char === 'string' ? options.newline_char : '\n';
          var max_width = typeof options === 'object' && typeof options.max_width === 'number' ? options.max_width : 0;
          var result = [];
          var header_exists = false;
          /* add the PGN header headerrmation */

          for (var i in header) {
            /* TODO: order of enumerated properties in header object is not
             * guaranteed, see ECMA-262 spec (section 12.6.4)
             */
            result.push('[' + i + ' "' + header[i] + '"]' + newline);
            header_exists = true;
          }

          if (header_exists && history.length) {
            result.push(newline);
          }
          /* pop all of history onto reversed_history */


          var reversed_history = [];

          while (history.length > 0) {
            reversed_history.push(undo_move());
          }

          var moves = [];
          var move_string = '';
          /* build the list of moves.  a move_string looks like: "3. e3 e6" */

          while (reversed_history.length > 0) {
            var move = reversed_history.pop();
            /* if the position started with black to move, start PGN with 1. ... */

            if (!history.length && move.color === 'b') {
              move_string = move_number + '. ...';
            } else if (move.color === 'w') {
              /* store the previous generated move_string if we have one */
              if (move_string.length) {
                moves.push(move_string);
              }

              move_string = move_number + '.';
            }

            move_string = move_string + ' ' + move_to_san(move, false);
            make_move(move);
          }
          /* are there any other leftover moves? */


          if (move_string.length) {
            moves.push(move_string);
          }
          /* is there a result? */


          if (typeof header.Result !== 'undefined') {
            moves.push(header.Result);
          }
          /* history should be back to what is was before we started generating PGN,
           * so join together moves
           */


          if (max_width === 0) {
            return result.join('') + moves.join(' ');
          }
          /* wrap the PGN output at max_width */


          var current_width = 0;

          for (var i = 0; i < moves.length; i++) {
            /* if the current move will push past max_width */
            if (current_width + moves[i].length > max_width && i !== 0) {
              /* don't end the line with whitespace */
              if (result[result.length - 1] === ' ') {
                result.pop();
              }

              result.push(newline);
              current_width = 0;
            } else if (i !== 0) {
              result.push(' ');
              current_width++;
            }

            result.push(moves[i]);
            current_width += moves[i].length;
          }

          return result.join('');
        },
        load_pgn: function (pgn, options) {
          // allow the user to specify the sloppy move parser to work around over
          // disambiguation bugs in Fritz and Chessbase
          var sloppy = typeof options !== 'undefined' && 'sloppy' in options ? options.sloppy : false;

          function mask(str) {
            return str.replace(/\\/g, '\\');
          }

          function has_keys(object) {
            for (var key in object) {
              return true;
            }

            return false;
          }

          function parse_pgn_header(header, options) {
            var newline_char = typeof options === 'object' && typeof options.newline_char === 'string' ? options.newline_char : '\r?\n';
            var header_obj = {};
            var headers = header.split(new RegExp(mask(newline_char)));
            var key = '';
            var value = '';

            for (var i = 0; i < headers.length; i++) {
              key = headers[i].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, '$1');
              value = headers[i].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, '$1');

              if (trim(key).length > 0) {
                header_obj[key] = value;
              }
            }

            return header_obj;
          }

          var newline_char = typeof options === 'object' && typeof options.newline_char === 'string' ? options.newline_char : '\r?\n'; // RegExp to split header. Takes advantage of the fact that header and movetext
          // will always have a blank line between them (ie, two newline_char's).
          // With default newline_char, will equal: /^(\[((?:\r?\n)|.)*\])(?:\r?\n){2}/

          var header_regex = new RegExp('^(\\[((?:' + mask(newline_char) + ')|.)*\\])' + '(?:' + mask(newline_char) + '){2}'); // If no header given, begin with moves.

          var header_string = header_regex.test(pgn) ? header_regex.exec(pgn)[1] : ''; // Put the board in the starting position

          reset();
          /* parse PGN header */

          var headers = parse_pgn_header(header_string, options);

          for (var key in headers) {
            set_header([key, headers[key]]);
          }
          /* load the starting position indicated by [Setup '1'] and
           * [FEN position] */


          if (headers['SetUp'] === '1') {
            if (!('FEN' in headers && load(headers['FEN'], true))) {
              // second argument to load: don't clear the headers
              return false;
            }
          }
          /* delete header to get the moves */


          var ms = pgn.replace(header_string, '').replace(new RegExp(mask(newline_char), 'g'), ' ');
          /* delete comments */

          ms = ms.replace(/(\{[^}]+\})+?/g, '');
          /* delete recursive annotation variations */

          var rav_regex = /(\([^\(\)]+\))+?/g;

          while (rav_regex.test(ms)) {
            ms = ms.replace(rav_regex, '');
          }
          /* delete move numbers */


          ms = ms.replace(/\d+\.(\.\.)?/g, '');
          /* delete ... indicating black to move */

          ms = ms.replace(/\.\.\./g, '');
          /* delete numeric annotation glyphs */

          ms = ms.replace(/\$\d+/g, '');
          /* trim and get array of moves */

          var moves = trim(ms).split(new RegExp(/\s+/));
          /* delete empty entries */

          moves = moves.join(',').replace(/,,+/g, ',').split(',');
          var move = '';

          for (var half_move = 0; half_move < moves.length - 1; half_move++) {
            move = move_from_san(moves[half_move], sloppy);
            /* move not possible! (don't clear the board to examine to show the
             * latest valid position)
             */

            if (move == null) {
              return false;
            } else {
              make_move(move);
            }
          }
          /* examine last move */


          move = moves[moves.length - 1];

          if (POSSIBLE_RESULTS.indexOf(move) > -1) {
            if (has_keys(header) && typeof header.Result === 'undefined') {
              set_header(['Result', move]);
            }
          } else {
            move = move_from_san(move, sloppy);

            if (move == null) {
              return false;
            } else {
              make_move(move);
            }
          }

          return true;
        },
        header: function () {
          return set_header(arguments);
        },
        ascii: function () {
          return ascii();
        },
        turn: function () {
          return turn;
        },
        move: function (move, options) {
          /* The move function can be called with in the following parameters:
           *
           * .move('Nxb7')      <- where 'move' is a case-sensitive SAN string
           *
           * .move({ from: 'h7', <- where the 'move' is a move object (additional
           *         to :'h8',      fields are ignored)
           *         promotion: 'q',
           *      })
           */
          // allow the user to specify the sloppy move parser to work around over
          // disambiguation bugs in Fritz and Chessbase
          var sloppy = typeof options !== 'undefined' && 'sloppy' in options ? options.sloppy : false;
          var move_obj = null;

          if (typeof move === 'string') {
            move_obj = move_from_san(move, sloppy);
          } else if (typeof move === 'object') {
            var moves = generate_moves();
            /* convert the pretty move object to an ugly move object */

            for (var i = 0, len = moves.length; i < len; i++) {
              if (move.from === algebraic(moves[i].from) && move.to === algebraic(moves[i].to) && (!('promotion' in moves[i]) || move.promotion === moves[i].promotion)) {
                move_obj = moves[i];
                break;
              }
            }
          }
          /* failed to find move */


          if (!move_obj) {
            return null;
          }
          /* need to make a copy of move because we can't generate SAN after the
           * move is made
           */


          var pretty_move = make_pretty(move_obj);
          make_move(move_obj);
          return pretty_move;
        },
        undo: function () {
          var move = undo_move();
          return move ? make_pretty(move) : null;
        },
        clear: function () {
          return clear();
        },
        put: function (piece, square) {
          return put(piece, square);
        },
        get: function (square) {
          return get(square);
        },
        remove: function (square) {
          return remove(square);
        },
        perft: function (depth) {
          return perft(depth);
        },
        square_color: function (square) {
          if (square in SQUARES) {
            var sq_0x88 = SQUARES[square];
            return (rank(sq_0x88) + file(sq_0x88)) % 2 === 0 ? 'light' : 'dark';
          }

          return null;
        },
        history: function (options) {
          var reversed_history = [];
          var move_history = [];
          var verbose = typeof options !== 'undefined' && 'verbose' in options && options.verbose;

          while (history.length > 0) {
            reversed_history.push(undo_move());
          }

          while (reversed_history.length > 0) {
            var move = reversed_history.pop();

            if (verbose) {
              move_history.push(make_pretty(move));
            } else {
              move_history.push(move_to_san(move));
            }

            make_move(move);
          }

          return move_history;
        }
      };
    };
    /* export Chess object if using node or any other CommonJS compatible
     * environment */


    if (typeof exports !== 'undefined') exports.Chess = Chess$1;
    /* export Chess object for any RequireJS compatible environment */

    if (typeof define !== 'undefined') define(function () {
      return Chess$1;
    });

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-pgn
     * License: MIT, see file 'LICENSE'
     */

    function IllegalMoveException(fen, notation) {
      this.fen = fen;
      this.notation = notation;

      this.toString = function () {
        return "IllegalMoveException: " + fen + " => " + notation;
      };
    }

    class History$1 {
      constructor(historyString = undefined, setUpFen = undefined, sloppy = false) {
        if (!historyString) {
          this.clear();
        } else {
          const parsedMoves = pgnParser.parse(historyString.replace(/\s\s+/g, " ").replace(/\n/g, " "));
          this.moves = this.traverse(parsedMoves[0], setUpFen, undefined, 1, sloppy);
        }

        this.setUpFen = setUpFen;
      }

      clear() {
        this.moves = [];
      }

      traverse(parsedMoves, fen, parent = undefined, ply = 1, sloppy = false) {
        const chess = fen ? new Chess$1(fen) : new Chess$1(); // chess.js must be included in HTML

        const moves = [];
        let previousMove = parent;

        for (let parsedMove of parsedMoves) {
          if (parsedMove.notation) {
            const notation = parsedMove.notation.notation;
            const move = chess.move(notation, {
              sloppy: sloppy
            });

            if (move) {
              if (previousMove) {
                move.previous = previousMove;
                previousMove.next = move;
              } else {
                move.previous = undefined;
              }

              move.ply = ply;
              this.fillMoveFromChessState(move, chess);

              if (parsedMove.nag) {
                move.nag = parsedMove.nag[0];
              }

              if (parsedMove.commentBefore) {
                move.commentBefore = parsedMove.commentBefore;
              }

              if (parsedMove.commentMove) {
                move.commentMove = parsedMove.commentMove;
              }

              if (parsedMove.commentAfter) {
                move.commentAfter = parsedMove.commentAfter;
              }

              move.variations = [];
              const parsedVariations = parsedMove.variations;

              if (parsedVariations.length > 0) {
                const lastFen = moves.length > 0 ? moves[moves.length - 1].fen : fen;

                for (let parsedVariation of parsedVariations) {
                  move.variations.push(this.traverse(parsedVariation, lastFen, previousMove, ply, sloppy));
                }
              }

              move.variation = moves;
              moves.push(move);
              previousMove = move;
            } else {
              throw new IllegalMoveException(chess.fen(), notation);
            }
          }

          ply++;
        }

        return moves;
      }

      fillMoveFromChessState(move, chess) {
        move.fen = chess.fen();
        move.variations = [];

        if (chess.game_over()) {
          move.gameOver = true;

          if (chess.in_draw()) {
            move.inDraw = true;
          }

          if (chess.in_stalemate()) {
            move.inStalemate = true;
          }

          if (chess.insufficient_material()) {
            move.insufficientMaterial = true;
          }

          if (chess.in_threefold_repetition()) {
            move.inThreefoldRepetition = true;
          }

          if (chess.in_checkmate()) {
            move.inCheckmate = true;
          }
        }

        if (chess.in_check()) {
          move.inCheck = true;
        }
      }
      /**
       * @param move
       * @return the history to the move which may be in a variant
       */


      historyToMove(move) {
        const moves = [];
        let pointer = move;
        moves.push(pointer);

        while (pointer.previous) {
          moves.push(pointer.previous);
          pointer = pointer.previous;
        }

        return moves.reverse();
      }

      addMove(notation, previous = undefined, sloppy = true) {
        if (!previous) {
          if (this.moves.length > 0) {
            previous = this.moves[this.moves.length - 1];
          }
        }

        const chess = new Chess$1(this.setUpFen ? this.setUpFen : undefined);

        if (previous) {
          const historyToMove = this.historyToMove(previous);

          for (const moveInHistory of historyToMove) {
            chess.move(moveInHistory);
          }
        }

        const move = chess.move(notation, {
          sloppy: sloppy
        });

        if (!move) {
          throw new Error("invalid move");
        }

        this.fillMoveFromChessState(move, chess);

        if (previous) {
          move.previous = previous;
          move.ply = previous.ply + 1;

          if (previous.next) {
            previous.next.variations.push([]);
            move.variation = previous.next.variations[previous.next.variations.length - 1];
            move.variation.push(move);
          } else {
            previous.next = move;
            move.variation = previous.variation;
            previous.variation.push(move);
          }
        } else {
          move.variation = this.moves;
          move.ply = 1;
          this.moves.push(move);
        }

        return move;
      }

      render() {
        // TODO Variants
        let rendered = ""; // let i = 0

        for (const move of this.moves) {
          rendered += move.san + " ";
        }

        return rendered;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-pgn
     * License: MIT, see file 'LICENSE'
     */
    class Pgn {
      constructor(pgnString = "", props = {}) {
        // only the header?
        const lastHeaderElement = pgnString.trim().substr(-1) === "]" ? pgnString.length : pgnString.lastIndexOf("]\n\n") + 1;
        const headerString = pgnString.substr(0, lastHeaderElement);
        const historyString = pgnString.substr(lastHeaderElement);
        const sloppy = !!props.sloppy;
        this.header = new Header(headerString);

        if (this.header.tags[TAGS.SetUp] === "1" && this.header.tags[TAGS.FEN]) {
          this.history = new History$1(historyString, this.header.tags[TAGS.FEN], sloppy);
        } else {
          this.history = new History$1(historyString, undefined, sloppy);
        }
      }

      render() {
        let pgn = "";
        pgn += this.header.render();
        pgn += "\n";
        pgn += this.history.render();
        return pgn;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chess
     * License: MIT, see file 'LICENSE'
     */
    const PIECES$1 = {
      p: {
        name: "pawn",
        value: 1
      },
      n: {
        name: "knight",
        value: 3
      },
      b: {
        name: "bishop",
        value: 3
      },
      r: {
        name: "rook",
        value: 5
      },
      q: {
        name: "queen",
        value: 9
      },
      k: {
        name: "king",
        value: Infinity
      }
    };
    const COLOR$1 = {
      white: "w",
      black: "b"
    };
    const FEN = {
      empty: "8/8/8/8/8/8/8/8 w - - 0 1",
      start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    };
    /**
     * Like chess.js, but handles variations and is written in ES5
     * Uses chess.js for validation and cm-pgn for the history and PGN header
     */

    class Chess {
      constructor(fenOrProps = FEN.start) {
        if (typeof fenOrProps === "string") {
          this.load(fenOrProps);
        } else {
          if (fenOrProps.fen) {
            this.load(fenOrProps.fen);
          } else if (fenOrProps.pgn) {
            this.loadPgn(fenOrProps.pgn);
          } else {
            this.load(FEN.start);
          }
        }
      }
      /**
       * @returns {string} the FEN of the last move, or the setUpFen(), if no move was made.
       */


      fen() {
        const lastMove = this.lastMove();

        if (lastMove) {
          return lastMove.fen;
        } else if (this.setUpFen()) {
          return this.setUpFen();
        } else {
          return FEN.start;
        }
      }
      /**
       * @returns {string} the setUp FEN in the header or the default start-FEN
       */


      setUpFen() {
        if (this.pgn.header.tags[TAGS.SetUp]) {
          return this.pgn.header.tags[TAGS.FEN];
        } else {
          return FEN.start;
        }
      }
      /**
       * @returns {Map<string, string>} the header tags of the PGN.
       */


      header() {
        return this.pgn.header.tags;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is over at that move
       */


      gameOver(move = this.lastMove()) {
        return move && move.gameOver;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is in draw at that move
       */


      inDraw(move = this.lastMove()) {
        return move && move.inDraw === true;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is in statemate at that move
       */


      inStalemate(move = this.lastMove()) {
        return move && move.inStalemate === true;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is in draw, because of unsufficiant material at that move
       */


      insufficientMaterial(move = this.lastMove()) {
        return move && move.insufficientMaterial === true;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is in draw, because of threefold repetition at that move
       */


      inThreefoldRepetition(move = this.lastMove()) {
        return move && move.inThreefoldRepetition === true;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is in checkmate at that move
       */


      inCheckmate(move = this.lastMove()) {
        return move && move.inCheckmate === true;
      }
      /**
       * @param move optional
       * @returns {boolean} true, if the game is in check at that move
       */


      inCheck(move = this.lastMove()) {
        return move && move.inCheck === true;
      }
      /**
       * cm-chess uses cm-pgn for the history and header. See https://github.com/shaack/cm-pgn
       * @returns {[]} the moves of the game history
       */


      history() {
        return this.pgn.history.moves;
      }
      /**
       * @returns {undefined|move} the last move of the main variant or `undefined`, if no move was made
       */


      lastMove() {
        if (this.pgn.history.moves.length > 0) {
          return this.pgn.history.moves[this.pgn.history.moves.length - 1];
        } else {
          return undefined;
        }
      }
      /**
       * Load a FEN
       * @param fen
       */


      load(fen) {
        const chess = new Chess$1(fen);

        if (chess && chess.fen() === fen) {
          this.pgn = new Pgn();

          if (fen !== FEN.start) {
            this.pgn.header.tags[TAGS.SetUp] = "1";
            this.pgn.header.tags[TAGS.FEN] = chess.fen();
            this.pgn.history.setUpFen = fen;
          }
        } else {
          throw Error("Invalid fen " + fen);
        }
      }
      /**
       * Load a PGN with variants, NAGs, header and annotations. cm-chess uses cm-pgn
       * fot the header and history. See https://github.com/shaack/cm-pgn
       * @param pgn
       */


      loadPgn(pgn) {
        this.pgn = new Pgn(pgn);
      }
      /**
       * Make a move in the game.
       * @param move
       * @param previousMove optional, the previous move (variants)
       * @param sloppy to allow sloppy SAN
       * @returns {{}|undefined}
       */


      move(move, previousMove = undefined, sloppy = true) {
        try {
          return this.pgn.history.addMove(move, previousMove, sloppy);
        } catch (e) {
          return undefined;
        }
      }
      /**
       * This one is not fully implemented in cm-pgn. For now, it just uses pgn() of chess.js.
       * @returns {string} the PGN of the game.
       */


      renderPgn() {
        // TODO create pgn with variants, annotations, nags (for now just render main variant)
        const chess = new Chess$1(this.setUpFen());
        const moves = this.pgn.history.moves;

        for (const move of moves) {
          chess.move(move);
        }

        return chess.pgn();
      }
      /**
       * Get the position of the specified figures at a specific move
       * @param type "p", "n", "b",...
       * @param color "b" or "w"
       * @param move
       * @returns {[]} the pieces (positions) at a specific move
       */


      pieces(type = undefined, color = undefined, move = this.lastMove()) {
        const chessJs = move ? new Chess$1(move.fen) : new Chess$1();
        let result = [];

        for (let i = 0; i < 64; i++) {
          const square = chessJs.SQUARES[i];
          const piece = chessJs.get(square);

          if (piece) {
            piece.square = square;
          }

          if (!type) {
            if (!color && piece) {
              result.push(piece);
            }
          } else if (!color && piece && piece.type === type) {
            result.push(piece);
          } else if (piece && piece.color === color && piece.type === type) {
            result.push(piece);
          }
        }

        return result;
      }
      /**
       * @returns {string} "b" or "w" the color to move in the main variant
       */


      turn() {
        let factor = 0;

        if (this.setUpFen()) {
          const fenParts = this.setUpFen().split(" ");

          if (fenParts[1] === COLOR$1.black) {
            factor = 1;
          }
        }

        return this.pgn.history.moves.length % 2 === factor ? COLOR$1.white : COLOR$1.black;
      }
      /**
       * Undo a move and all moves after it
       * @param move
       */


      undo(move = this.lastMove()) {
        // decouple from previous
        if (move.previous) {
          move.previous.next = undefined;
        } // splice all next moves


        const index = move.variation.findIndex(element => {
          return element.ply === move.ply;
        });
        move.variation = move.variation.splice(index);
      }

      plyCount() {
        return this.history().length;
      }

      fenOfPly(plyNumber) {
        if (plyNumber > 0) {
          return this.history()[plyNumber - 1].fen;
        } else {
          return this.setUpFen();
        }
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chessboard
     * License: MIT, see file 'LICENSE'
     */
    const STATE = {
      waitForInputStart: 0,
      pieceClickedThreshold: 1,
      clickTo: 2,
      secondClickThreshold: 3,
      dragTo: 4,
      clickDragTo: 5,
      moveDone: 6,
      reset: 7
    };
    const MOVE_CANCELED_REASON = {
      secondClick: "secondClick",
      movedOutOfBoard: "movedOutOfBoard",
      draggedBack: "draggedBack",
      clickedAnotherPiece: "clickedAnotherPiece"
    };
    const DRAG_THRESHOLD = 4;
    class ChessboardMoveInput {
      constructor(view, moveStartCallback, moveDoneCallback, moveCanceledCallback) {
        this.view = view;
        this.chessboard = view.chessboard;
        this.moveStartCallback = moveStartCallback;
        this.moveDoneCallback = moveDoneCallback;
        this.moveCanceledCallback = moveCanceledCallback;
        this.setMoveInputState(STATE.waitForInputStart);
      }

      setMoveInputState(newState, params = undefined) {
        // console.log("setMoveInputState", Object.keys(STATE)[this.moveInputState], "=>", Object.keys(STATE)[newState]);
        const prevState = this.moveInputState;
        this.moveInputState = newState;

        switch (newState) {
          case STATE.waitForInputStart:
            break;

          case STATE.pieceClickedThreshold:
            if (STATE.waitForInputStart !== prevState && STATE.clickTo !== prevState) {
              throw new Error("moveInputState");
            }

            if (this.pointerMoveListener) {
              removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
              this.pointerMoveListener = undefined;
            }

            if (this.pointerUpListener) {
              removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
              this.pointerUpListener = undefined;
            }

            this.startIndex = params.index;
            this.endIndex = undefined;
            this.movedPiece = params.piece;
            this.updateStartEndMarkers();
            this.startPoint = params.point;

            if (!this.pointerMoveListener && !this.pointerUpListener) {
              if (params.type === "mousedown") {
                this.pointerMoveListener = this.onPointerMove.bind(this);
                this.pointerMoveListener.type = "mousemove";
                addEventListener("mousemove", this.pointerMoveListener);
                this.pointerUpListener = this.onPointerUp.bind(this);
                this.pointerUpListener.type = "mouseup";
                addEventListener("mouseup", this.pointerUpListener);
              } else if (params.type === "touchstart") {
                this.pointerMoveListener = this.onPointerMove.bind(this);
                this.pointerMoveListener.type = "touchmove";
                addEventListener("touchmove", this.pointerMoveListener);
                this.pointerUpListener = this.onPointerUp.bind(this);
                this.pointerUpListener.type = "touchend";
                addEventListener("touchend", this.pointerUpListener);
              } else {
                throw Error("event type");
              }
            } else {
              throw Error("_pointerMoveListener or _pointerUpListener");
            }

            break;

          case STATE.clickTo:
            if (this.draggablePiece) {
              Svg.removeElement(this.draggablePiece);
              this.draggablePiece = undefined;
            }

            if (prevState === STATE.dragTo) {
              this.view.setPieceVisibility(params.index);
            }

            break;

          case STATE.secondClickThreshold:
            if (STATE.clickTo !== prevState) {
              throw new Error("moveInputState");
            }

            this.startPoint = params.point;
            break;

          case STATE.dragTo:
            if (STATE.pieceClickedThreshold !== prevState) {
              throw new Error("moveInputState");
            }

            if (this.view.chessboard.state.inputEnabled) {
              this.view.setPieceVisibility(params.index, false);
              this.createDraggablePiece(params.piece);
            }

            break;

          case STATE.clickDragTo:
            if (STATE.secondClickThreshold !== prevState) {
              throw new Error("moveInputState");
            }

            if (this.view.chessboard.state.inputEnabled) {
              this.view.setPieceVisibility(params.index, false);
              this.createDraggablePiece(params.piece);
            }

            break;

          case STATE.moveDone:
            if ([STATE.dragTo, STATE.clickTo, STATE.clickDragTo].indexOf(prevState) === -1) {
              throw new Error("moveInputState");
            }

            this.endIndex = params.index;

            if (this.endIndex && this.moveDoneCallback(this.startIndex, this.endIndex)) {
              const prevSquares = this.chessboard.state.squares.slice(0);
              this.chessboard.state.setPiece(this.startIndex, undefined);
              this.chessboard.state.setPiece(this.endIndex, this.movedPiece);

              if (prevState === STATE.clickTo) {
                this.updateStartEndMarkers();
                this.view.animatePieces(prevSquares, this.chessboard.state.squares.slice(0), () => {
                  this.setMoveInputState(STATE.reset);
                });
              } else {
                this.view.drawPieces(this.chessboard.state.squares);
                this.setMoveInputState(STATE.reset);
              }
            } else {
              this.view.drawPieces();
              this.setMoveInputState(STATE.reset);
            }

            break;

          case STATE.reset:
            if (this.startIndex && !this.endIndex && this.movedPiece) {
              this.chessboard.state.setPiece(this.startIndex, this.movedPiece);
            }

            this.startIndex = undefined;
            this.endIndex = undefined;
            this.movedPiece = undefined;
            this.updateStartEndMarkers();

            if (this.draggablePiece) {
              Svg.removeElement(this.draggablePiece);
              this.draggablePiece = undefined;
            }

            if (this.pointerMoveListener) {
              removeEventListener(this.pointerMoveListener.type, this.pointerMoveListener);
              this.pointerMoveListener = undefined;
            }

            if (this.pointerUpListener) {
              removeEventListener(this.pointerUpListener.type, this.pointerUpListener);
              this.pointerUpListener = undefined;
            }

            this.setMoveInputState(STATE.waitForInputStart);
            break;

          default:
            throw Error(`moveInputState ${newState}`);
        }
      }

      createDraggablePiece(pieceName) {
        if (this.draggablePiece) {
          throw Error("draggablePiece exists");
        }

        this.draggablePiece = Svg.createSvg(document.body);
        this.draggablePiece.classList.add("cm-chessboard-draggable-piece");
        this.draggablePiece.setAttribute("width", this.view.squareWidth);
        this.draggablePiece.setAttribute("height", this.view.squareHeight);
        this.draggablePiece.setAttribute("style", "pointer-events: none");
        this.draggablePiece.name = pieceName;
        const spriteUrl = this.chessboard.props.sprite.cache ? "" : this.chessboard.props.sprite.url;
        const piece = Svg.addElement(this.draggablePiece, "use", {
          href: `${spriteUrl}#${pieceName}`
        });
        const scaling = this.view.squareHeight / this.chessboard.props.sprite.size;
        const transformScale = this.draggablePiece.createSVGTransform();
        transformScale.setScale(scaling, scaling);
        piece.transform.baseVal.appendItem(transformScale);
      }

      moveDraggablePiece(x, y) {
        this.draggablePiece.setAttribute("style", `pointer-events: none; position: absolute; left: ${x - this.view.squareHeight / 2}px; top: ${y - this.view.squareHeight / 2}px`);
      }

      onPointerDown(e) {
        if (e.type === "mousedown" && e.button === 0 || e.type === "touchstart") {
          const index = e.target.getAttribute("data-index");
          const pieceElement = this.view.getPiece(index);
          let pieceName, color;

          if (pieceElement) {
            pieceName = pieceElement.getAttribute("data-piece");
            color = pieceName ? pieceName.substr(0, 1) : undefined; // allow scrolling, if not pointed on draggable piece

            if (color === "w" && this.chessboard.state.inputWhiteEnabled || color === "b" && this.chessboard.state.inputBlackEnabled) {
              e.preventDefault();
            }
          }

          if (index) {
            // pointer on square
            if (this.moveInputState !== STATE.waitForInputStart || this.chessboard.state.inputWhiteEnabled && color === "w" || this.chessboard.state.inputBlackEnabled && color === "b") {
              let point;

              if (e.type === "mousedown") {
                point = {
                  x: e.clientX,
                  y: e.clientY
                };
              } else if (e.type === "touchstart") {
                point = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY
                };
              }

              if (this.moveInputState === STATE.waitForInputStart && pieceName && this.moveStartCallback(index)) {
                this.setMoveInputState(STATE.pieceClickedThreshold, {
                  index: index,
                  piece: pieceName,
                  point: point,
                  type: e.type
                });
              } else if (this.moveInputState === STATE.clickTo) {
                if (index === this.startIndex) {
                  this.setMoveInputState(STATE.secondClickThreshold, {
                    index: index,
                    piece: pieceName,
                    point: point,
                    type: e.type
                  });
                } else {
                  const pieceName = this.chessboard.getPiece(SQUARE_COORDINATES[index]);
                  const pieceColor = pieceName ? pieceName.substr(0, 1) : undefined;
                  const startPieceName = this.chessboard.getPiece(SQUARE_COORDINATES[this.startIndex]);
                  const startPieceColor = startPieceName ? startPieceName.substr(0, 1) : undefined;

                  if (color && startPieceColor === pieceColor) {
                    // https://github.com/shaack/cm-chessboard/issues/40
                    this.moveCanceledCallback(MOVE_CANCELED_REASON.clickedAnotherPiece, this.startIndex, index);

                    if (this.moveStartCallback(index)) {
                      this.setMoveInputState(STATE.pieceClickedThreshold, {
                        index: index,
                        piece: pieceName,
                        point: point,
                        type: e.type
                      });
                    } else {
                      this.setMoveInputState(STATE.reset);
                    }
                  } else {
                    this.setMoveInputState(STATE.moveDone, {
                      index: index
                    });
                  }
                }
              }
            }
          }
        }
      }

      onPointerMove(e) {
        let pageX, pageY, clientX, clientY, target;

        if (e.type === "mousemove") {
          clientX = e.clientX;
          clientY = e.clientY;
          pageX = e.pageX;
          pageY = e.pageY;
          target = e.target;
        } else if (e.type === "touchmove") {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
          pageX = e.touches[0].pageX;
          pageY = e.touches[0].pageY;
          target = document.elementFromPoint(clientX, clientY);
        }

        if (this.moveInputState === STATE.pieceClickedThreshold || this.moveInputState === STATE.secondClickThreshold) {
          if (Math.abs(this.startPoint.x - clientX) > DRAG_THRESHOLD || Math.abs(this.startPoint.y - clientY) > DRAG_THRESHOLD) {
            if (this.moveInputState === STATE.secondClickThreshold) {
              this.setMoveInputState(STATE.clickDragTo, {
                index: this.startIndex,
                piece: this.movedPiece
              });
            } else {
              this.setMoveInputState(STATE.dragTo, {
                index: this.startIndex,
                piece: this.movedPiece
              });
            }

            if (this.view.chessboard.state.inputEnabled) {
              this.moveDraggablePiece(pageX, pageY);
            }
          }
        } else if (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo || this.moveInputState === STATE.clickTo) {
          if (target && target.getAttribute && target.parentElement === this.view.boardGroup) {
            const index = target.getAttribute("data-index");

            if (index !== this.startIndex && index !== this.endIndex) {
              this.endIndex = index;
              this.updateStartEndMarkers();
            } else if (index === this.startIndex && this.endIndex !== undefined) {
              this.endIndex = undefined;
              this.updateStartEndMarkers();
            }
          } else {
            if (this.endIndex !== undefined) {
              this.endIndex = undefined;
              this.updateStartEndMarkers();
            }
          }

          if (this.view.chessboard.state.inputEnabled && (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo)) {
            this.moveDraggablePiece(pageX, pageY);
          }
        }
      }

      onPointerUp(e) {
        let target;

        if (e.type === "mouseup") {
          target = e.target;
        } else if (e.type === "touchend") {
          target = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }

        if (target && target.getAttribute) {
          const index = target.getAttribute("data-index");

          if (index) {
            if (this.moveInputState === STATE.dragTo || this.moveInputState === STATE.clickDragTo) {
              if (this.startIndex === index) {
                if (this.moveInputState === STATE.clickDragTo) {
                  this.chessboard.state.setPiece(this.startIndex, this.movedPiece);
                  this.view.setPieceVisibility(this.startIndex);
                  this.moveCanceledCallback(MOVE_CANCELED_REASON.draggedBack, index, index);
                  this.setMoveInputState(STATE.reset);
                } else {
                  this.setMoveInputState(STATE.clickTo, {
                    index: index
                  });
                }
              } else {
                this.setMoveInputState(STATE.moveDone, {
                  index: index
                });
              }
            } else if (this.moveInputState === STATE.pieceClickedThreshold) {
              this.setMoveInputState(STATE.clickTo, {
                index: index
              });
            } else if (this.moveInputState === STATE.secondClickThreshold) {
              this.setMoveInputState(STATE.reset);
              this.moveCanceledCallback(MOVE_CANCELED_REASON.secondClick, index, index);
            }
          } else {
            this.view.drawPieces();
            const moveStartIndex = this.startIndex;
            this.setMoveInputState(STATE.reset);
            this.moveCanceledCallback(MOVE_CANCELED_REASON.movedOutOfBoard, moveStartIndex, undefined);
          }
        } else {
          this.view.drawPieces();
          this.setMoveInputState(STATE.reset);
        }
      }

      updateStartEndMarkers() {
        if (this.chessboard.props.style.moveFromMarker) {
          this.chessboard.state.removeMarkers(undefined, this.chessboard.props.style.moveFromMarker);
        }

        if (this.chessboard.props.style.moveToMarker) {
          this.chessboard.state.removeMarkers(undefined, this.chessboard.props.style.moveToMarker);
        }

        if (this.chessboard.props.style.moveFromMarker) {
          if (this.startIndex) {
            this.chessboard.state.addMarker(this.startIndex, this.chessboard.props.style.moveFromMarker);
          }
        }

        if (this.chessboard.props.style.moveToMarker) {
          if (this.endIndex) {
            this.chessboard.state.addMarker(this.endIndex, this.chessboard.props.style.moveToMarker);
          }
        }

        this.view.drawMarkers();
      }

      reset() {
        this.setMoveInputState(STATE.reset);
      }

      destroy() {
        this.reset();
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chessboard
     * License: MIT, see file 'LICENSE'
     */
    const CHANGE_TYPE = {
      move: 0,
      appear: 1,
      disappear: 2
    };
    class ChessboardPiecesAnimation {
      constructor(view, fromSquares, toSquares, duration, callback) {
        this.view = view;

        if (fromSquares && toSquares) {
          this.animatedElements = this.createAnimation(fromSquares, toSquares);
          this.duration = duration;
          this.callback = callback;
          this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
        }
      }

      seekChanges(fromSquares, toSquares) {
        const appearedList = [],
              disappearedList = [],
              changes = [];

        for (let i = 0; i < 64; i++) {
          const previousSquare = fromSquares[i];
          const newSquare = toSquares[i];

          if (newSquare !== previousSquare) {
            if (newSquare) {
              appearedList.push({
                piece: newSquare,
                index: i
              });
            }

            if (previousSquare) {
              disappearedList.push({
                piece: previousSquare,
                index: i
              });
            }
          }
        }

        appearedList.forEach(appeared => {
          let shortestDistance = 8;
          let foundMoved = undefined;
          disappearedList.forEach(disappeared => {
            if (appeared.piece === disappeared.piece) {
              const moveDistance = this.squareDistance(appeared.index, disappeared.index);

              if (moveDistance < shortestDistance) {
                foundMoved = disappeared;
                shortestDistance = moveDistance;
              }
            }
          });

          if (foundMoved) {
            disappearedList.splice(disappearedList.indexOf(foundMoved), 1); // remove from disappearedList, because it is moved now

            changes.push({
              type: CHANGE_TYPE.move,
              piece: appeared.piece,
              atIndex: foundMoved.index,
              toIndex: appeared.index
            });
          } else {
            changes.push({
              type: CHANGE_TYPE.appear,
              piece: appeared.piece,
              atIndex: appeared.index
            });
          }
        });
        disappearedList.forEach(disappeared => {
          changes.push({
            type: CHANGE_TYPE.disappear,
            piece: disappeared.piece,
            atIndex: disappeared.index
          });
        });
        return changes;
      }

      createAnimation(fromSquares, toSquares) {
        const changes = this.seekChanges(fromSquares, toSquares);
        const animatedElements = [];
        changes.forEach(change => {
          const animatedItem = {
            type: change.type
          };

          switch (change.type) {
            case CHANGE_TYPE.move:
              animatedItem.element = this.view.getPiece(change.atIndex);
              animatedItem.atPoint = this.view.squareIndexToPoint(change.atIndex);
              animatedItem.toPoint = this.view.squareIndexToPoint(change.toIndex);
              break;

            case CHANGE_TYPE.appear:
              animatedItem.element = this.view.drawPiece(change.atIndex, change.piece);
              animatedItem.element.style.opacity = 0;
              break;

            case CHANGE_TYPE.disappear:
              animatedItem.element = this.view.getPiece(change.atIndex);
              break;
          }

          animatedElements.push(animatedItem);
        });
        return animatedElements;
      }

      animationStep(time) {
        if (!this.startTime) {
          this.startTime = time;
        }

        const timeDiff = time - this.startTime;

        if (timeDiff <= this.duration) {
          this.frameHandle = requestAnimationFrame(this.animationStep.bind(this));
        } else {
          cancelAnimationFrame(this.frameHandle);
          this.callback();
          return;
        }

        const t = Math.min(1, timeDiff / this.duration);
        const progress = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut

        this.animatedElements.forEach(animatedItem => {
          if (animatedItem.element) {
            switch (animatedItem.type) {
              case CHANGE_TYPE.move:
                animatedItem.element.transform.baseVal.removeItem(0);
                const transform = this.view.svg.createSVGTransform();
                transform.setTranslate(animatedItem.atPoint.x + (animatedItem.toPoint.x - animatedItem.atPoint.x) * progress, animatedItem.atPoint.y + (animatedItem.toPoint.y - animatedItem.atPoint.y) * progress);
                animatedItem.element.transform.baseVal.appendItem(transform);
                break;

              case CHANGE_TYPE.appear:
                animatedItem.element.style.opacity = progress;
                break;

              case CHANGE_TYPE.disappear:
                animatedItem.element.style.opacity = 1 - progress;
                break;
            }
          } else {
            console.warn("animatedItem has no element", animatedItem);
          }
        });
      }

      squareDistance(index1, index2) {
        const file1 = index1 % 8;
        const rank1 = Math.floor(index1 / 8);
        const file2 = index2 % 8;
        const rank2 = Math.floor(index2 / 8);
        return Math.max(Math.abs(rank2 - rank1), Math.abs(file2 - file1));
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chessboard
     * License: MIT, see file 'LICENSE'
     */
    const SQUARE_COORDINATES = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1", "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7", "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];
    class ChessboardView {
      constructor(chessboard, callbackAfterCreation) {
        this.animationRunning = false;
        this.currentAnimation = undefined;
        this.chessboard = chessboard;
        this.moveInput = new ChessboardMoveInput(this, this.moveStartCallback.bind(this), this.moveDoneCallback.bind(this), this.moveCanceledCallback.bind(this));
        this.animationQueue = [];

        if (chessboard.props.sprite.cache) {
          this.cacheSprite();
        }

        if (chessboard.props.responsive) {
          // noinspection JSUnresolvedVariable
          if (typeof ResizeObserver !== "undefined") {
            // noinspection JSUnresolvedFunction
            this.resizeObserver = new ResizeObserver(() => {
              this.handleResize();
            });
            this.resizeObserver.observe(this.chessboard.element);
          } else {
            this.resizeListener = this.handleResize.bind(this);
            window.addEventListener("resize", this.resizeListener);
          }
        }

        this.pointerDownListener = this.pointerDownHandler.bind(this);
        this.chessboard.element.addEventListener("mousedown", this.pointerDownListener);
        this.chessboard.element.addEventListener("touchstart", this.pointerDownListener);
        this.createSvgAndGroups();
        this.updateMetrics();
        callbackAfterCreation(this);

        if (chessboard.props.responsive) {
          this.handleResize();
        }
      }

      pointerDownHandler(e) {
        this.moveInput.onPointerDown(e);
      }

      destroy() {
        this.moveInput.destroy();

        if (this.resizeObserver) {
          this.resizeObserver.unobserve(this.chessboard.element);
        }

        if (this.resizeListener) {
          window.removeEventListener("resize", this.resizeListener);
        }

        this.chessboard.element.removeEventListener("mousedown", this.pointerDownListener);
        this.chessboard.element.removeEventListener("touchstart", this.pointerDownListener);
        Svg.removeElement(this.svg);
        this.animationQueue = [];

        if (this.currentAnimation) {
          cancelAnimationFrame(this.currentAnimation.frameHandle);
        }
      } // Sprite //


      cacheSprite() {
        const wrapperId = "chessboardSpriteCache";

        if (!document.getElementById(wrapperId)) {
          const wrapper = document.createElement("div");
          wrapper.style.display = "none";
          wrapper.id = wrapperId;
          document.body.appendChild(wrapper);
          const xhr = new XMLHttpRequest();
          xhr.open("GET", this.chessboard.props.sprite.url, true);

          xhr.onload = function () {
            wrapper.insertAdjacentHTML('afterbegin', xhr.response);
          };

          xhr.send();
        }
      }

      createSvgAndGroups() {
        if (this.svg) {
          Svg.removeElement(this.svg);
        }

        this.svg = Svg.createSvg(this.chessboard.element);
        let cssClass = this.chessboard.props.style.cssClass ? this.chessboard.props.style.cssClass : "default";
        this.svg.setAttribute("class", "cm-chessboard border-type-" + this.chessboard.props.style.borderType + " " + cssClass);
        this.updateMetrics();
        this.boardGroup = Svg.addElement(this.svg, "g", {
          class: "board"
        });
        this.coordinatesGroup = Svg.addElement(this.svg, "g", {
          class: "coordinates"
        });
        this.markersGroup = Svg.addElement(this.svg, "g", {
          class: "markers"
        });
        this.piecesGroup = Svg.addElement(this.svg, "g", {
          class: "pieces"
        });
      }

      updateMetrics() {
        this.width = this.chessboard.element.clientWidth;
        this.height = this.chessboard.element.clientHeight;

        if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
          this.borderSize = this.width / 25;
        } else if (this.chessboard.props.style.borderType === BORDER_TYPE.thin) {
          this.borderSize = this.width / 320;
        } else {
          this.borderSize = 0;
        }

        this.innerWidth = this.width - 2 * this.borderSize;
        this.innerHeight = this.height - 2 * this.borderSize;
        this.squareWidth = this.innerWidth / 8;
        this.squareHeight = this.innerHeight / 8;
        this.scalingX = this.squareWidth / this.chessboard.props.sprite.size;
        this.scalingY = this.squareHeight / this.chessboard.props.sprite.size;
        this.pieceXTranslate = this.squareWidth / 2 - this.chessboard.props.sprite.size * this.scalingY / 2;
      }

      handleResize() {
        if (this.chessboard.props.style.aspectRatio) {
          this.chessboard.element.style.height = this.chessboard.element.clientWidth * this.chessboard.props.style.aspectRatio + "px";
        }

        if (this.chessboard.element.clientWidth !== this.width || this.chessboard.element.clientHeight !== this.height) {
          this.updateMetrics();
          this.redraw();
        }

        this.svg.setAttribute("width", "100%"); // safari bugfix

        this.svg.setAttribute("height", "100%");
      }

      redraw() {
        this.drawBoard();
        this.drawCoordinates();
        this.drawMarkers();
        this.setCursor();
        this.drawPieces(this.chessboard.state.squares);
      } // Board //


      drawBoard() {
        while (this.boardGroup.firstChild) {
          this.boardGroup.removeChild(this.boardGroup.lastChild);
        }

        if (this.chessboard.props.style.borderType !== BORDER_TYPE.none) {
          let boardBorder = Svg.addElement(this.boardGroup, "rect", {
            width: this.width,
            height: this.height
          });
          boardBorder.setAttribute("class", "border");

          if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
            const innerPos = this.borderSize;
            let borderInner = Svg.addElement(this.boardGroup, "rect", {
              x: innerPos,
              y: innerPos,
              width: this.width - innerPos * 2,
              height: this.height - innerPos * 2
            });
            borderInner.setAttribute("class", "border-inner");
          }
        }

        for (let i = 0; i < 64; i++) {
          const index = this.chessboard.state.orientation === COLOR.white ? i : 63 - i;
          const squareColor = (9 * index & 8) === 0 ? 'black' : 'white';
          const fieldClass = `square ${squareColor}`;
          const point = this.squareIndexToPoint(index);
          const squareRect = Svg.addElement(this.boardGroup, "rect", {
            x: point.x,
            y: point.y,
            width: this.squareWidth,
            height: this.squareHeight
          });
          squareRect.setAttribute("class", fieldClass);
          squareRect.setAttribute("data-index", "" + index);
        }
      }

      drawCoordinates() {
        if (!this.chessboard.props.style.showCoordinates) {
          return;
        }

        while (this.coordinatesGroup.firstChild) {
          this.coordinatesGroup.removeChild(this.coordinatesGroup.lastChild);
        }

        const inline = this.chessboard.props.style.borderType !== BORDER_TYPE.frame;

        for (let file = 0; file < 8; file++) {
          let x = this.borderSize + (17 + this.chessboard.props.sprite.size * file) * this.scalingX;
          let y = this.height - this.scalingY * 3.5;
          let cssClass = "coordinate file";

          if (inline) {
            x = x + this.scalingX * 15.5;
            cssClass += file % 2 ? " white" : " black";
          }

          const textElement = Svg.addElement(this.coordinatesGroup, "text", {
            class: cssClass,
            x: x,
            y: y,
            style: `font-size: ${this.scalingY * 10}px`
          });

          if (this.chessboard.state.orientation === COLOR.white) {
            textElement.textContent = String.fromCharCode(97 + file);
          } else {
            textElement.textContent = String.fromCharCode(104 - file);
          }
        }

        for (let rank = 0; rank < 8; rank++) {
          let x = this.borderSize / 3.7;
          let y = this.borderSize + 25 * this.scalingY + rank * this.squareHeight;
          let cssClass = "coordinate rank";

          if (inline) {
            cssClass += rank % 2 ? " black" : " white";

            if (this.chessboard.props.style.borderType === BORDER_TYPE.frame) {
              x = x + this.scalingX * 10;
              y = y - this.scalingY * 15;
            } else {
              x = x + this.scalingX * 2;
              y = y - this.scalingY * 15;
            }
          }

          const textElement = Svg.addElement(this.coordinatesGroup, "text", {
            class: cssClass,
            x: x,
            y: y,
            style: `font-size: ${this.scalingY * 10}px`
          });

          if (this.chessboard.state.orientation === COLOR.white) {
            textElement.textContent = "" + (8 - rank);
          } else {
            textElement.textContent = "" + (1 + rank);
          }
        }
      } // Pieces //


      drawPieces(squares = this.chessboard.state.squares) {
        const childNodes = Array.from(this.piecesGroup.childNodes);

        for (let i = 0; i < 64; i++) {
          const pieceName = squares[i];

          if (pieceName) {
            this.drawPiece(i, pieceName);
          }
        }

        for (const childNode of childNodes) {
          this.piecesGroup.removeChild(childNode);
        }
      }

      drawPiece(index, pieceName) {
        const pieceGroup = Svg.addElement(this.piecesGroup, "g");
        pieceGroup.setAttribute("data-piece", pieceName);
        pieceGroup.setAttribute("data-index", index);
        const point = this.squareIndexToPoint(index);
        const transform = this.svg.createSVGTransform();
        transform.setTranslate(point.x, point.y);
        pieceGroup.transform.baseVal.appendItem(transform);
        const spriteUrl = this.chessboard.props.sprite.cache ? "" : this.chessboard.props.sprite.url;
        const pieceUse = Svg.addElement(pieceGroup, "use", {
          href: `${spriteUrl}#${pieceName}`,
          class: "piece"
        }); // center on square

        const transformTranslate = this.svg.createSVGTransform();
        transformTranslate.setTranslate(this.pieceXTranslate, 0);
        pieceUse.transform.baseVal.appendItem(transformTranslate); // scale

        const transformScale = this.svg.createSVGTransform();
        transformScale.setScale(this.scalingY, this.scalingY);
        pieceUse.transform.baseVal.appendItem(transformScale);
        return pieceGroup;
      }

      setPieceVisibility(index, visible = true) {
        const piece = this.getPiece(index);

        if (visible) {
          piece.setAttribute("visibility", "visible");
        } else {
          piece.setAttribute("visibility", "hidden");
        }
      }

      getPiece(index) {
        return this.piecesGroup.querySelector(`g[data-index='${index}']`);
      } // Markers //


      drawMarkers() {
        while (this.markersGroup.firstChild) {
          this.markersGroup.removeChild(this.markersGroup.firstChild);
        }

        this.chessboard.state.markers.forEach(marker => {
          this.drawMarker(marker);
        });
      }

      drawMarker(marker) {
        const markerGroup = Svg.addElement(this.markersGroup, "g");
        markerGroup.setAttribute("data-index", marker.index);
        const point = this.squareIndexToPoint(marker.index);
        const transform = this.svg.createSVGTransform();
        transform.setTranslate(point.x, point.y);
        markerGroup.transform.baseVal.appendItem(transform);
        const spriteUrl = this.chessboard.props.sprite.cache ? "" : this.chessboard.props.sprite.url;
        const markerUse = Svg.addElement(markerGroup, "use", {
          href: `${spriteUrl}#${marker.type.slice}`,
          class: "marker " + marker.type.class
        });
        const transformScale = this.svg.createSVGTransform();
        transformScale.setScale(this.scalingX, this.scalingY);
        markerUse.transform.baseVal.appendItem(transformScale);
        return markerGroup;
      } // animation queue //


      animatePieces(fromSquares, toSquares, callback) {
        this.animationQueue.push({
          fromSquares: fromSquares,
          toSquares: toSquares,
          callback: callback
        });

        if (!this.animationRunning) {
          this.nextPieceAnimationInQueue();
        }
      }

      nextPieceAnimationInQueue() {
        const nextAnimation = this.animationQueue.shift();

        if (nextAnimation !== undefined) {
          this.animationRunning = true;
          this.currentAnimation = new ChessboardPiecesAnimation(this, nextAnimation.fromSquares, nextAnimation.toSquares, this.chessboard.props.animationDuration / (this.animationQueue.length + 1), () => {
            if (!this.moveInput.draggablePiece) {
              this.drawPieces(nextAnimation.toSquares);
              this.animationRunning = false;
              this.nextPieceAnimationInQueue();

              if (nextAnimation.callback) {
                nextAnimation.callback();
              }
            } else {
              this.animationRunning = false;
              this.nextPieceAnimationInQueue();

              if (nextAnimation.callback) {
                nextAnimation.callback();
              }
            }
          });
        }
      } // enable and disable move input //


      enableMoveInput(eventHandler, color = undefined) {
        if (color === COLOR.white) {
          this.chessboard.state.inputWhiteEnabled = true;
        } else if (color === COLOR.black) {
          this.chessboard.state.inputBlackEnabled = true;
        } else {
          this.chessboard.state.inputWhiteEnabled = true;
          this.chessboard.state.inputBlackEnabled = true;
        }

        this.chessboard.state.inputEnabled = true;
        this.moveInputCallback = eventHandler;
        this.setCursor();
      }

      disableMoveInput() {
        this.chessboard.state.inputWhiteEnabled = false;
        this.chessboard.state.inputBlackEnabled = false;
        this.chessboard.state.inputEnabled = false;
        this.moveInputCallback = undefined;
        this.setCursor();
      } // callbacks //


      moveStartCallback(index) {
        if (this.moveInputCallback) {
          return this.moveInputCallback({
            chessboard: this.chessboard,
            type: INPUT_EVENT_TYPE.moveStart,
            square: SQUARE_COORDINATES[index]
          });
        } else {
          return true;
        }
      }

      moveDoneCallback(fromIndex, toIndex) {
        if (this.moveInputCallback) {
          return this.moveInputCallback({
            chessboard: this.chessboard,
            type: INPUT_EVENT_TYPE.moveDone,
            squareFrom: SQUARE_COORDINATES[fromIndex],
            squareTo: SQUARE_COORDINATES[toIndex]
          });
        } else {
          return true;
        }
      }

      moveCanceledCallback(reason, fromIndex, toIndex) {
        if (this.moveInputCallback) {
          this.moveInputCallback({
            chessboard: this.chessboard,
            type: INPUT_EVENT_TYPE.moveCanceled,
            reason: reason,
            squareFrom: SQUARE_COORDINATES[fromIndex],
            squareTo: toIndex ? SQUARE_COORDINATES[toIndex] : undefined
          });
        }
      } // Helpers //


      setCursor() {
        if (this.chessboard.state) {
          // fix https://github.com/shaack/cm-chessboard/issues/47
          if (this.chessboard.state.inputWhiteEnabled || this.chessboard.state.inputBlackEnabled || this.chessboard.state.squareSelectEnabled) {
            this.boardGroup.setAttribute("class", "board input-enabled");
          } else {
            this.boardGroup.setAttribute("class", "board");
          }
        }
      }

      squareIndexToPoint(index) {
        let x, y;

        if (this.chessboard.state.orientation === COLOR.white) {
          x = this.borderSize + index % 8 * this.squareWidth;
          y = this.borderSize + (7 - Math.floor(index / 8)) * this.squareHeight;
        } else {
          x = this.borderSize + (7 - index % 8) * this.squareWidth;
          y = this.borderSize + Math.floor(index / 8) * this.squareHeight;
        }

        return {
          x: x,
          y: y
        };
      }

    }
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    class Svg {
      /**
       * create the Svg in the HTML DOM
       * @param containerElement
       * @returns {Element}
       */
      static createSvg(containerElement = undefined) {
        let svg = document.createElementNS(SVG_NAMESPACE, "svg");

        if (containerElement) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          containerElement.appendChild(svg);
        }

        return svg;
      }
      /**
       * Add an Element to a SVG DOM
       * @param parent
       * @param name
       * @param attributes
       * @returns {Element}
       */


      static addElement(parent, name, attributes) {
        let element = document.createElementNS(SVG_NAMESPACE, name);

        if (name === "use") {
          attributes["xlink:href"] = attributes["href"]; // fix for safari
        }

        for (let attribute in attributes) {
          if (attributes.hasOwnProperty(attribute)) {
            if (attribute.indexOf(":") !== -1) {
              const value = attribute.split(":");
              element.setAttributeNS("http://www.w3.org/1999/" + value[0], value[1], attributes[attribute]);
            } else {
              element.setAttribute(attribute, attributes[attribute]);
            }
          }
        }

        parent.appendChild(element);
        return element;
      }
      /**
       * Remove an Element from a SVG DOM
       * @param element
       */


      static removeElement(element) {
        element.parentNode.removeChild(element);
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chessboard
     * License: MIT, see file 'LICENSE'
     */
    class ChessboardState {
      constructor() {
        this.squares = new Array(64).fill(null);
        this.orientation = undefined;
        this.markers = [];
        this.inputWhiteEnabled = false;
        this.inputBlackEnabled = false;
        this.inputEnabled = false;
        this.squareSelectEnabled = false;
      }

      setPiece(index, piece) {
        this.squares[index] = piece;
      }

      addMarker(index, type) {
        this.markers.push({
          index: index,
          type: type
        });
      }

      removeMarkers(index = undefined, type = undefined) {
        if (!index && !type) {
          this.markers = [];
        } else {
          this.markers = this.markers.filter(marker => {
            if (!marker.type) {
              if (index === marker.index) {
                return false;
              }
            } else if (!index) {
              if (marker.type === type) {
                return false;
              }
            } else if (marker.type === type && index === marker.index) {
              return false;
            }

            return true;
          });
        }
      }

      setPosition(fen) {
        if (fen) {
          const parts = fen.replace(/^\s*/, "").replace(/\s*$/, "").split(/\/|\s/);

          for (let part = 0; part < 8; part++) {
            const row = parts[7 - part].replace(/\d/g, str => {
              const numSpaces = parseInt(str);
              let ret = '';

              for (let i = 0; i < numSpaces; i++) {
                ret += '-';
              }

              return ret;
            });

            for (let c = 0; c < 8; c++) {
              const char = row.substr(c, 1);
              let piece = null;

              if (char !== '-') {
                if (char.toUpperCase() === char) {
                  piece = `w${char.toLowerCase()}`;
                } else {
                  piece = `b${char}`;
                }
              }

              this.squares[part * 8 + c] = piece;
            }
          }
        }
      }

      getPosition() {
        let parts = new Array(8).fill("");

        for (let part = 0; part < 8; part++) {
          let spaceCounter = 0;

          for (let i = 0; i < 8; i++) {
            const piece = this.squares[part * 8 + i];

            if (!piece) {
              spaceCounter++;
            } else {
              if (spaceCounter > 0) {
                parts[7 - part] += spaceCounter;
                spaceCounter = 0;
              }

              const color = piece.substr(0, 1);
              const name = piece.substr(1, 1);

              if (color === "w") {
                parts[7 - part] += name.toUpperCase();
              } else {
                parts[7 - part] += name;
              }
            }
          }

          if (spaceCounter > 0) {
            parts[7 - part] += spaceCounter;
            spaceCounter = 0;
          }
        }

        return parts.join("/");
      }

      squareToIndex(square) {
        const file = square.substr(0, 1).charCodeAt(0) - 97;
        const rank = square.substr(1, 1) - 1;
        return 8 * rank + file;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chessboard
     * License: MIT, see file 'LICENSE'
     */
    const COLOR = {
      white: "w",
      black: "b"
    };
    const INPUT_EVENT_TYPE = {
      moveStart: "moveStart",
      moveDone: "moveDone",
      moveCanceled: "moveCanceled"
    };
    const SQUARE_SELECT_TYPE = {
      primary: "primary",
      secondary: "secondary"
    };
    const BORDER_TYPE = {
      none: "none",
      // no border
      thin: "thin",
      // thin border
      frame: "frame" // wide border with coordinates in it

    };
    const MARKER_TYPE = {
      frame: {
        class: "marker-frame",
        slice: "markerFrame"
      },
      square: {
        class: "marker-square",
        slice: "markerSquare"
      },
      dot: {
        class: "marker-dot",
        slice: "markerDot"
      },
      circle: {
        class: "marker-circle",
        slice: "markerCircle"
      }
    };
    const FEN_START_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    const FEN_EMPTY_POSITION = "8/8/8/8/8/8/8/8";
    class Chessboard {
      constructor(element, props = {}) {
        // TODO rename element to context
        if (!element) {
          throw new Error("container element is " + element);
        }

        this.element = element;
        let defaultProps = {
          position: "empty",
          // set as fen, "start" or "empty"
          orientation: COLOR.white,
          // white on bottom
          style: {
            cssClass: "default",
            showCoordinates: true,
            // show ranks and files
            borderType: BORDER_TYPE.thin,
            // thin: thin border, frame: wide border with coordinates in it, none: no border
            aspectRatio: 1,
            // height/width. Set to `undefined`, if you want to define it only in the css.
            moveFromMarker: MARKER_TYPE.frame,
            // the marker used to mark the start square
            moveToMarker: MARKER_TYPE.frame,
            // the marker used to mark the square where the figure is moving to
            moveMarker: MARKER_TYPE.frame,
            // deprecated => moveFromMarker // TODO remove in future
            hoverMarker: MARKER_TYPE.frame // deprecated => moveToMarker // TODO remove in future

          },
          responsive: true,
          // resizes the board based on element size
          animationDuration: 300,
          // pieces animation duration in milliseconds
          sprite: {
            url: "./assets/images/chessboard-sprite-staunty.svg",
            // pieces and markers are stored as svg sprite
            size: 40,
            // the sprite size, defaults to 40x40px
            cache: true // cache the sprite inline, in the HTML

          }
        };
        this.props = {};
        Object.assign(this.props, defaultProps);
        Object.assign(this.props, props);
        this.props.sprite = defaultProps.sprite;
        this.props.style = defaultProps.style;

        if (props.sprite) {
          Object.assign(this.props.sprite, props.sprite);
        }

        if (props.style) {
          Object.assign(this.props.style, props.style);
        }

        if (this.props.style.moveMarker !== MARKER_TYPE.frame) {
          // TODO remove in future
          console.warn("this.props.style.moveMarker is deprecated, use this.props.style.moveFromMarker");
          this.props.style.moveFromMarker = this.props.style.moveMarker;
        }

        if (this.props.style.hoverMarker !== MARKER_TYPE.frame) {
          // TODO remove in future
          console.warn("this.props.style.hoverMarker is deprecated, use this.props.style.moveToMarker");
          this.props.style.moveToMarker = this.props.style.hoverMarker;
        }

        if (this.props.style.aspectRatio) {
          this.element.style.height = this.element.offsetWidth * this.props.style.aspectRatio + "px";
        }

        this.state = new ChessboardState();
        this.state.orientation = this.props.orientation;
        this.view = new ChessboardView(this, view => {
          if (this.props.position === "start") {
            this.state.setPosition(FEN_START_POSITION);
          } else if (this.props.position === "empty" || this.props.position === undefined) {
            this.state.setPosition(FEN_EMPTY_POSITION);
          } else {
            this.state.setPosition(this.props.position);
          }

          view.redraw();
        });
      } // API //


      setPiece(square, piece) {
        this.state.setPiece(this.state.squareToIndex(square), piece);
        this.view.drawPieces(this.state.squares);
      }

      getPiece(square) {
        return this.state.squares[this.state.squareToIndex(square)];
      }

      movePiece(squareFrom, squareTo, animated = true) {
        return new Promise((resolve, reject) => {
          const prevSquares = this.state.squares.slice(0); // clone

          const pieceFrom = this.getPiece(squareFrom);

          if (!pieceFrom) {
            reject("no piece on square " + squareFrom);
          } else {
            this.state.squares[this.state.squareToIndex(squareFrom)] = null;
            this.state.squares[this.state.squareToIndex(squareTo)] = pieceFrom;

            if (animated) {
              this.view.animatePieces(prevSquares, this.state.squares, () => {
                resolve();
              });
            } else {
              this.view.drawPieces(this.state.squares);
              resolve();
            }
          }
        });
      }

      setPosition(fen, animated = true) {
        return new Promise(resolve => {
          if (fen === "start") {
            fen = FEN_START_POSITION;
          } else if (fen === "empty") {
            fen = FEN_EMPTY_POSITION;
          }

          const currentFen = this.state.getPosition();
          const fenParts = fen.split(" ");
          const fenNormalized = fenParts[0];

          if (fenNormalized !== currentFen) {
            const prevSquares = this.state.squares.slice(0); // clone

            this.state.setPosition(fen);

            if (animated) {
              this.view.animatePieces(prevSquares, this.state.squares.slice(0), () => {
                resolve();
              });
            } else {
              this.view.drawPieces(this.state.squares);
              resolve();
            }
          } else {
            resolve();
          }
        });
      }

      getPosition() {
        return this.state.getPosition();
      }

      addMarker(square, type) {
        if (!type) {
          console.error("Error addMarker(), type is " + type);
        }

        this.state.addMarker(this.state.squareToIndex(square), type);
        this.view.drawMarkers();
      }

      getMarkers(square = undefined, type = undefined) {
        const markersFound = [];
        this.state.markers.forEach(marker => {
          const markerSquare = SQUARE_COORDINATES[marker.index];

          if (!square && (!type || type === marker.type) || !type && square === markerSquare || type === marker.type && square === markerSquare) {
            markersFound.push({
              square: SQUARE_COORDINATES[marker.index],
              type: marker.type
            });
          }
        });
        return markersFound;
      }

      removeMarkers(square = undefined, type = undefined) {
        const index = square ? this.state.squareToIndex(square) : undefined;
        this.state.removeMarkers(index, type);
        this.view.drawMarkers();
      }

      setOrientation(color) {
        this.state.orientation = color;
        return this.view.redraw();
      }

      getOrientation() {
        return this.state.orientation;
      }

      destroy() {
        this.view.destroy();
        this.view = undefined;
        this.state = undefined;

        if (this.squareSelectListener) {
          this.element.removeEventListener("contextmenu", this.squareSelectListener);
          this.element.removeEventListener("mouseup", this.squareSelectListener);
          this.element.removeEventListener("touchend", this.squareSelectListener);
        }
      }

      enableMoveInput(eventHandler, color = undefined) {
        this.view.enableMoveInput(eventHandler, color);
      }

      disableMoveInput() {
        this.view.disableMoveInput();
      } // TODO remove deprecated function
      // noinspection JSUnusedGlobalSymbols


      enableContextInput(eventHandler) {
        console.warn("enableContextInput() is deprecated, use enableSquareSelect()");
        this.enableSquareSelect(function (event) {
          if (event.type === SQUARE_SELECT_TYPE.secondary) {
            eventHandler(event);
          }
        });
      } // TODO remove deprecated function
      // noinspection JSUnusedGlobalSymbols


      disableContextInput() {
        this.disableSquareSelect();
      }

      enableSquareSelect(eventHandler) {
        if (this.squareSelectListener) {
          console.warn("squareSelectListener already existing");
          return;
        }

        this.squareSelectListener = function (e) {
          const index = e.target.getAttribute("data-index");

          if (e.type === "contextmenu") {
            // disable context menu
            e.preventDefault();
            return;
          }

          eventHandler({
            chessboard: this,
            type: e.button === 2 ? SQUARE_SELECT_TYPE.secondary : SQUARE_SELECT_TYPE.primary,
            square: SQUARE_COORDINATES[index]
          });
        };

        this.element.addEventListener("contextmenu", this.squareSelectListener);
        this.element.addEventListener("mouseup", this.squareSelectListener);
        this.element.addEventListener("touchend", this.squareSelectListener);
        this.state.squareSelectEnabled = true;
        this.view.setCursor();
      }

      disableSquareSelect() {
        this.element.removeEventListener("contextmenu", this.squareSelectListener);
        this.element.removeEventListener("mouseup", this.squareSelectListener);
        this.element.removeEventListener("touchend", this.squareSelectListener);
        this.squareSelectListener = undefined;
        this.state.squareSelectEnabled = false;
        this.view.setCursor();
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class I18n {
      constructor(props = {}) {
        this.props = {
          locale: null,
          fallbackLang: "en" // used, when the translation was not found for locale

        };
        Object.assign(this.props, props);
        this.locale = this.props.locale;

        if (!this.locale) {
          const htmlLang = document.documentElement.getAttribute("lang");

          if (htmlLang) {
            this.locale = htmlLang;
          }

          if (!this.locale) {
            this.locale = navigator.language;
          }
        }

        this.lang = this.locale.substr(0, 2);
        this.translations = {};
      }

      load(dictionary) {
        let fetchPromises = [];

        for (const lang in dictionary) {
          if (dictionary.hasOwnProperty(lang)) {
            if (!this.translations[lang]) {
              this.translations[lang] = {};
            }

            const translations = dictionary[lang];

            if (typeof translations === "string") {
              fetchPromises.push(new Promise(resolve => {
                fetch(translations).then(res => res.json()).then(json => {
                  Object.assign(this.translations[lang], json);
                  resolve();
                }).catch(err => {
                  throw err;
                });
              }));
            } else {
              Object.assign(this.translations[lang], translations);
            }
          }
        }

        if (fetchPromises.length > 0) {
          return Promise.all(fetchPromises);
        } else {
          return Promise.resolve();
        }
      }

      t(code, ...values) {
        let translation;

        if (this.translations[this.locale] && this.translations[this.locale][code]) {
          translation = this.translations[this.locale][code];
        } else if (this.translations[this.lang] && this.translations[this.lang][code]) {
          translation = this.translations[this.lang][code];
        } else if (this.translations[this.props.fallbackLang][code]) {
          translation = this.translations[this.props.fallbackLang][code];
        } else {
          console.warn("Error, no translation found for locale:", this.locale, ", lang: ", this.lang, ", code: ", code);
          return "?" + code + "?";
        }

        if (values && values.length > 0) {
          let i = 1;

          for (const value of values) {
            translation = translation.replace(new RegExp("\\$" + i, "g"), value);
            i++;
          }
        }

        return translation;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class MessageBroker {
      constructor() {
        this.topics = [];
      }

      subscribe(topic, callback) {
        if (!topic) {
          const message = "subscribe: topic needed";
          console.error(message, callback);
          throw new Error(message);
        }

        if (!callback) {
          const message = "subscribe: callback needed";
          console.error(message, topic);
          throw new Error(message);
        }

        if (this.topics[topic] === undefined) {
          this.topics[topic] = [];
        }

        if (this.topics[topic].indexOf(callback) === -1) {
          this.topics[topic].push(callback);
        }
      }

      unsubscribe(topic = null, callback = null) {
        if (callback !== null && topic !== null) {
          this.topics[topic].splice(this.topics[topic].indexOf(callback), 1);
        } else if (callback === null && topic !== null) {
          this.topics[topic] = [];
        } else if (topic === null && callback !== null) {
          for (const topicName in this.topics) {
            // noinspection JSUnfilteredForInLoop
            const topic = this.topics[topicName];

            for (const topicSubscriber of topic) {
              if (topicSubscriber === callback) {
                // noinspection JSUnfilteredForInLoop
                this.unsubscribe(topicName, callback);
              }
            }
          }
        } else {
          this.topics = [];
        }

        if (topic !== null) {
          if (this.topics[topic] && this.topics[topic].length === 0) {
            delete this.topics[topic];
          }
        }
      }

      publish(topic, object = {}, async = true) {
        if (!topic) {
          const message = "publish: topic needed";
          console.error(message, object);
          throw new Error(message);
        }

        const breadcrumbArray = topic.split("/");
        let wildcardTopic = "";

        for (const topicPart of breadcrumbArray) {
          this.callback(wildcardTopic + "#", topic, object, async);
          wildcardTopic += topicPart + "/";
        }

        this.callback(topic, topic, object, async);
      }

      callback(wildcardTopic, topic, object = {}, async = true) {
        if (this.topics[wildcardTopic]) {
          this.topics[wildcardTopic].forEach(function (callback) {
            if (async) {
              setTimeout(function () {
                callback(object, topic);
              });
            } else {
              return callback(object, topic);
            }
          });
        }
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    const collectionMutationMethods = {
      array: ["copyWithin", "fill", "pop", "push", "reverse", "shift", "unshift", "sort", "splice"],
      set: ["add", "clear", "delete"],
      map: ["set", "clear", "delete"]
    };
    const registry = new Map();
    class Observe {
      /**
       * Intercept a function call before the function is executed. Can manipulate
       * arguments in callback.
       * @param object
       * @param functionName allows multiple names as array
       * @param callback
       * @returns Object with `remove` function to remove the interceptor
       */
      static preFunction(object, functionName, callback) {
        if (Array.isArray(functionName)) {
          let removes = [];
          functionName.forEach(functionNameItem => {
            removes.push(Observe.preFunction(object, functionNameItem, callback));
          });
          return {
            remove: () => {
              removes.forEach(remove => {
                remove.remove();
              });
            }
          };
        }

        if (!registry.has(object)) {
          registry.set(object, {});
        }

        const registryObject = registry.get(object);

        if (registryObject.observedPreFunctions === undefined) {
          registryObject.observedPreFunctions = new Map();
        }

        if (!registryObject.observedPreFunctions.has(functionName)) {
          registryObject.observedPreFunctions.set(functionName, new Set());
          const originalMethod = object[functionName];

          object[functionName] = function () {
            let functionArguments = arguments;
            registryObject.observedPreFunctions.get(functionName).forEach(function (callback) {
              const params = {
                functionName: functionName,
                arguments: functionArguments
              };
              const callbackReturn = callback(params);

              if (callbackReturn) {
                functionArguments = callbackReturn;
              }
            });
            return originalMethod.apply(object, functionArguments);
          };
        }

        registryObject.observedPreFunctions.get(functionName).add(callback);
        return {
          remove: () => {
            registryObject.observedPreFunctions.get(functionName).delete(callback);
          }
        };
      }
      /**
       * Intercept a function call after the function is executed. Can manipulate
       * returnValue in callback.
       * @param object
       * @param functionName allows multiple names as array
       * @param callback
       * @returns Object with `remove` function to remove the interceptor
       */


      static postFunction(object, functionName, callback) {
        if (Array.isArray(functionName)) {
          let removes = [];
          functionName.forEach(functionNameItem => {
            removes.push(Observe.postFunction(object, functionNameItem, callback));
          });
          return {
            remove: () => {
              removes.forEach(remove => {
                remove.remove();
              });
            }
          };
        }

        if (!registry.has(object)) {
          registry.set(object, {});
        }

        const registryObject = registry.get(object);

        if (registryObject.observedPostFunctions === undefined) {
          registryObject.observedPostFunctions = new Map();
        }

        if (!registryObject.observedPostFunctions.has(functionName)) {
          registryObject.observedPostFunctions.set(functionName, new Set());
          const originalMethod = object[functionName];

          object[functionName] = function () {
            let returnValue = originalMethod.apply(object, arguments);
            const functionArguments = arguments;
            registryObject.observedPostFunctions.get(functionName).forEach(function (callback) {
              const params = {
                functionName: functionName,
                arguments: functionArguments,
                returnValue: returnValue
              };
              callback(params);
              returnValue = params.returnValue; // modifiable if called synced
            });
            return returnValue;
          };
        }

        registryObject.observedPostFunctions.get(functionName).add(callback);
        return {
          remove: () => {
            registryObject.observedPostFunctions.get(functionName).delete(callback);
          }
        };
      }
      /**
       * Observe properties (attributes) of an object. Works also with Arrays, Maps and Sets.
       * The parameter `propertyName` can be an array of names to observe multiple properties.
       * @param object
       * @param propertyName allows multiple names as array
       * @param callback
       */


      static property(object, propertyName, callback) {
        if (Array.isArray(propertyName)) {
          let removes = [];
          propertyName.forEach(propertyNameItem => {
            removes.push(Observe.property(object, propertyNameItem, callback));
          });
          return {
            remove: () => {
              removes.forEach(remove => {
                remove.remove();
              });
            }
          };
        }

        if (!object.hasOwnProperty(propertyName)) {
          console.error("Observe.property", object, "missing property: " + propertyName);
          return;
        }

        let isCollection = false;

        if (!registry.has(object)) {
          registry.set(object, {});
        }

        const registryObject = registry.get(object);

        if (registryObject.observedProperties === undefined) {
          registryObject.observedProperties = new Map();
        }

        if (!registryObject.observedProperties.has(propertyName)) {
          registryObject.observedProperties.set(propertyName, {
            value: object[propertyName],
            observers: new Set()
          });
          const property = object[propertyName];
          let mutationMethods = [];

          if (property instanceof Array) {
            isCollection = true;
            mutationMethods = collectionMutationMethods.array;
          } else if (property instanceof Set || property instanceof WeakSet) {
            isCollection = true;
            mutationMethods = collectionMutationMethods.set;
          } else if (property instanceof Map || property instanceof WeakMap) {
            isCollection = true;
            mutationMethods = collectionMutationMethods.map;
          }

          if (delete object[propertyName]) {
            // handling for simple properties
            Object.defineProperty(object, propertyName, {
              get: function () {
                return registryObject.observedProperties.get(propertyName).value;
              },
              set: function (newValue) {
                const oldValue = registryObject.observedProperties.get(propertyName).value;

                if (newValue !== oldValue) {
                  registryObject.observedProperties.get(propertyName).value = newValue;
                  registryObject.observedProperties.get(propertyName).observers.forEach(function (callback) {
                    const params = {
                      propertyName: propertyName,
                      oldValue: oldValue,
                      newValue: newValue
                    };
                    callback(params);
                  });
                }
              },
              enumerable: true,
              configurable: true
            });

            if (isCollection) {
              // handling for Collections
              mutationMethods.forEach(function (methodName) {
                object[propertyName][methodName] = function () {
                  // object[propertyName].constructor.prototype[methodName] is Array or Set or...
                  // noinspection JSPotentiallyInvalidConstructorUsage
                  object[propertyName].constructor.prototype[methodName].apply(this, arguments);
                  const methodArguments = arguments;
                  registryObject.observedProperties.get(propertyName).observers.forEach(function (observer) {
                    const params = {
                      propertyName: propertyName,
                      methodName: methodName,
                      arguments: methodArguments,
                      newValue: object[propertyName]
                    };
                    observer(params);
                  });
                };
              });
            }
          } else {
            console.error("Error: Observe.property", propertyName, "failed");
          }
        }

        registryObject.observedProperties.get(propertyName).observers.add(callback);
        return {
          remove: () => {
            registryObject.observedProperties.get(propertyName).observers.delete(callback);
          }
        };
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class ChessConsoleState {
      constructor(props) {
        this.chess = new Chess(); // used to validate moves and keep the history

        this.orientation = props.playerColor || COLOR.white;
        this.plyViewed = 0; // the play viewed on the board
      }

      observeChess(callback) {
        const chessManipulationMethods = ['move', 'clear', 'load', 'loadPgn', 'put', 'remove', 'reset', 'undo'];
        chessManipulationMethods.forEach(methodName => {
          Observe.postFunction(this.chess, methodName, params => {
            callback(params);
          });
        });
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class Component {
      constructor(props = {}, state = {}) {
        this.props = props;
        this.state = state;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class DomUtils {
      // https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom
      static isElementVisible(element) {
        return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
      } // https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport


      static isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
      }

      static getFormInputValues(context) {
        const inputs = context.querySelectorAll("input,select");
        const values = {};
        inputs.forEach(input => {
          if (input.type === "checkbox") {
            values[input.id] = !!input.checked;
          } else {
            values[input.id] = input.value;
          }
        });
        return values;
      }

      static isBrowserDarkMode() {
        return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      }

      static browserSupportsPreferredColorScheme() {
        return window.matchMedia && (window.matchMedia('(prefers-color-scheme: dark)').matches || window.matchMedia('(prefers-color-scheme: light)').matches);
      }

      static loadJs(src) {
        const element = document.createElement('script');
        element.setAttribute("type", "text/javascript");
        element.setAttribute("src", src);
        document.getElementsByTagName("head")[0].appendChild(element);
      }

      static loadCss(src) {
        const element = document.createElement("link");
        element.setAttribute("rel", "stylesheet");
        element.setAttribute("type", "text/css");
        element.setAttribute("href", src);
        document.getElementsByTagName("head")[0].appendChild(element);
      }

      static setCustomProperty(name, value, element = document.documentElement) {
        element.style.setProperty("--" + name, value.trim());
      }

      static getCustomProperty(name, element = document.documentElement) {
        return getComputedStyle(element).getPropertyValue('--' + name).trim();
      }

      static createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
      }

      static insertAfter(newChild, refChild) {
        refChild.parentNode.insertBefore(newChild, refChild.nextSibling);
      }

      static delegate(element, eventName, selector, handler) {
        const eventListener = function (event) {
          let target = event.target;

          while (target && target !== this) {
            if (target.matches(selector)) {
              handler.call(target, event);
            }

            target = target.parentNode;
          }
        };

        element.addEventListener(eventName, eventListener);
        return {
          remove: function () {
            element.removeEventListener(eventName, eventListener);
          }
        };
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class UiComponent extends Component {
      constructor(context, props = {}, state = {}) {
        super(props, state);
        this.context = context;
        this.actions = {};
      }
      /**
       * Searches for "data-event-listener" attributes in the HTML, and couples them with actions.
       * Tag Attributes:
       *  - `data-event-listener`: The event "click", "change",...
       *  - `data-action`: The action in this.actions, called on the event
       *  - `data-delegate`: Query selector, to delegate the event from a child element
       */


      addDataEventListeners(context = this.context) {
        const eventListenerElements = context.querySelectorAll("[data-event-listener]");

        if (this.props.debug) {
          console.log("eventListenerElements", context, eventListenerElements);
        }

        for (const eventListenerElement of eventListenerElements) {
          const eventName = eventListenerElement.dataset.eventListener;
          const action = eventListenerElement.dataset.action;
          const delegate = eventListenerElement.dataset.delegate;

          if (!this.actions[action]) {
            console.error(context, "You have to add the action \"" + action + "\" to your component.");
          }

          if (delegate) {
            DomUtils.delegate(eventListenerElement, eventName, delegate, target => {
              if (this.props.debug) {
                console.log("delegate", action, target);
              }

              this.actions[action](target);
            });
          } else {
            if (this.props.debug) {
              console.log("addEventListener", eventName, action);
            }

            eventListenerElement.addEventListener(eventName, this.actions[action].bind(this));
          }
        }

        return this;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    const consoleMessageTopics = {
      // newGame: "game/new", // remove this (deprecated)
      initGame: "game/init",
      gameOver: "game/over",
      moveRequest: "game/moveRequest",
      legalMove: "game/move/legal",
      illegalMove: "game/move/illegal",
      moveUndone: "game/move/undone",
      load: "game/load"
    }; // @deprecated, may be deleted in future versions, use `consoleMessageTopics`
    // export const messageBrokerTopics = consoleMessageTopics

    class ChessConsole extends UiComponent {
      constructor(context, player, opponent, props = {}, state = new ChessConsoleState(props)) {
        super(context, props, state);
        this.props = {
          figuresSpriteFile: undefined,
          // used also in player for promotion
          locale: navigator.language,
          // locale for i18n
          playerColor: COLOR.white,
          // the players color (color at bottom)
          pgn: undefined // initial pgn, can contain header and history

        };

        if (!this.props.figures) {
          this.props.figures = {
            Rw: '<i class="fas fa-fw fa-chess-rook fa-figure-white"></i>',
            Nw: '<i class="fas fa-fw fa-chess-knight fa-figure-white"></i>',
            Bw: '<i class="fas fa-fw fa-chess-bishop fa-figure-white"></i>',
            Qw: '<i class="fas fa-fw fa-chess-queen fa-figure-white"></i>',
            Kw: '<i class="fas fa-fw fa-chess-king fa-figure-white"></i>',
            Pw: '<i class="fas fa-fw fa-chess-pawn fa-figure-white"></i>',
            Rb: '<i class="fas fa-fw fa-chess-rook fa-figure-black"></i>',
            Nb: '<i class="fas fa-fw fa-chess-knight fa-figure-black"></i>',
            Bb: '<i class="fas fa-fw fa-chess-bishop fa-figure-black"></i>',
            Qb: '<i class="fas fa-fw fa-chess-queen fa-figure-black"></i>',
            Kb: '<i class="fas fa-fw fa-chess-king fa-figure-black"></i>',
            Pb: '<i class="fas fa-fw fa-chess-pawn fa-figure-black"></i>'
          };
        }

        const colSets = {
          consoleGame: "col-xl-7 order-xl-2 col-lg-8 order-lg-1 order-md-1 col-md-12 order-md-1",
          consoleRight: "",
          consoleLeft: "col-xl-3 order-xl-3 col-lg-4 order-lg-2 col-md-8 order-md-3"
        };

        if (!this.props.template) {
          this.props.template = `<div class="row chess-console">
    <div class="chess-console-center ${colSets.consoleGame}">
        <div class="chess-console-board"></div>
    </div>

    <div class="chess-console-left ${colSets.consoleLeft}"></div>
</div>`;
        }

        Object.assign(this.props, props);
        this.i18n = new I18n({
          locale: props.locale
        });
        this.messageBroker = new MessageBroker();
        this.context.innerHTML = this.props.template;
        this.componentContainers = {
          center: this.context.querySelector(".chess-console-center"),
          left: this.context.querySelector(".chess-console-left"),
          right: this.context.querySelector(".chess-console-right"),
          board: this.context.querySelector(".chess-console-board"),
          controlButtons: this.context.querySelector(".control-buttons"),
          notifications: this.context.querySelector(".chess-console-notifications")
        };
        this.player = new player.type(this, player.name, player.props);
        this.opponent = new opponent.type(this, opponent.name, opponent.props);
        this.initialization = new Promise(resolve => {
          this.i18n.load({
            de: {
              ok: "OK",
              cancel: "Abbrechen"
            },
            en: {
              ok: "OK",
              cancel: "Cancel"
            }
          }).then(() => {
            resolve(this);
          });
        });
      }

      initGame(props = {}, requestNextMove = true) {
        Object.assign(this.props, props);
        this.state.orientation = this.props.playerColor;

        if (props.pgn) {
          this.state.chess.loadPgn(props.pgn, {
            sloppy: true
          });
          this.state.plyViewed = this.state.chess.plyCount();
        } else if (props.history) {
          console.warn("props.history is deprecated, use props.pgn");
          this.state.chess.loadPgn(props.history, {
            sloppy: true
          });
          this.state.plyViewed = this.state.chess.plyCount();
        } else {
          this.state.chess.load(FEN.start);
          this.state.plyViewed = 0;
        }

        if (requestNextMove) {
          this.nextMove();
        }

        this.messageBroker.publish(consoleMessageTopics.initGame, {
          props: props
        });
      } // @deprecated use initGame()


      newGame(props = {}) {
        console.warn("newGame is deprecated, use initGame");
        this.initGame(props);
      }

      playerWhite() {
        return this.props.playerColor === COLOR.white ? this.player : this.opponent;
      }

      playerBlack() {
        return this.props.playerColor === COLOR.white ? this.opponent : this.player;
      }

      playerToMove() {
        if (this.state.chess.gameOver()) {
          return null;
        } else {
          if (this.state.chess.turn() === "w") {
            return this.playerWhite();
          } else {
            return this.playerBlack();
          }
        }
      }
      /*
       * - calls `moveRequest()` in next player
       */


      nextMove() {
        const playerToMove = this.playerToMove();

        if (playerToMove) {
          this.messageBroker.publish(consoleMessageTopics.moveRequest, {
            playerToMove: playerToMove
          });
          setTimeout(() => {
            playerToMove.moveRequest(this.state.chess.fen(), move => {
              return this.handleMoveResponse(move);
            });
          });
        }
      }
      /*
       * - validates move
       * - requests nextMove
       */


      handleMoveResponse(move) {
        const playerMoved = this.playerToMove();
        const moveResult = this.state.chess.move(move);

        if (!moveResult) {
          if (this.props.debug) {
            console.warn("illegalMove", this.state.chess, move);
          }

          this.messageBroker.publish(consoleMessageTopics.illegalMove, {
            playerMoved: playerMoved,
            move: move
          });
          return moveResult;
        }

        if (this.state.plyViewed === this.state.chess.plyCount() - 1) {
          this.state.plyViewed++;
        }

        this.messageBroker.publish(consoleMessageTopics.legalMove, {
          playerMoved: playerMoved,
          move: move,
          moveResult: moveResult
        });

        if (!this.state.chess.gameOver()) {
          this.nextMove();
        } else {
          let wonColor = null;

          if (this.state.chess.inCheckmate()) {
            wonColor = this.state.chess.turn() === COLOR.white ? COLOR.black : COLOR.white;
          }

          this.messageBroker.publish(consoleMessageTopics.gameOver, {
            wonColor: wonColor
          });
        }

        return moveResult;
      }

      undoMove() {
        this.state.chess.undo();

        if (this.playerToMove() !== this.player) {
          this.state.chess.undo();
        }

        if (this.state.plyViewed > this.state.chess.plyCount()) {
          this.state.plyViewed = this.state.chess.plyCount();
        }

        this.messageBroker.publish(consoleMessageTopics.moveUndone);
        this.nextMove();
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class ChessConsolePlayer {
      constructor(chessConsole, name, props) {
        this.chessConsole = chessConsole;
        this.name = name;
        this.props = props;
      }
      /**
       * Called, when the Console requests the next Move from a Player.
       * The Player should answer the moveRequest with a moveResponse.
       * The moveResponse then returns the move result, if no move result was returned, the move was not legal.
       * @param fen current position
       * @param moveResponse a callback function to call as the moveResponse. Parameter is an object,
       * containing 'from' and `to`. Example: `moveResult = moveResponse({from: "e2", to: "e4})`.
       */


      moveRequest(fen, moveResponse) {}

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/bootstrap-show-modal
     * License: MIT, see file 'LICENSE'
     */
    (function ($) {

      var i = 0;

      function Modal(props) {
        this.props = {
          title: "",
          // the dialog title html
          body: "",
          // the dialog body html
          footer: "",
          // the dialog footer html (mainly used for buttons)
          modalClass: "fade",
          // Additional css for ".modal", "fade" for fade effect
          modalDialogClass: "",
          // Additional css for ".modal-dialog", like "modal-lg" or "modal-sm" for sizing
          options: {
            // The Bootstrap modal options as described here: https://getbootstrap.com/docs/4.0/components/modal/#options
            backdrop: 'static' // disallow closing on click in the background

          },
          // Events:
          onCreate: null,
          // Callback, called after the modal was created
          onShown: null,
          // Callback, called after the modal was shown and completely faded in
          onDispose: null,
          // Callback, called after the modal was disposed
          onSubmit: null // Callback of $.showConfirm(), called after yes or no was pressed

        };

        for (var prop in props) {
          // noinspection JSUnfilteredForInLoop
          this.props[prop] = props[prop];
        }

        this.id = "bootstrap-show-modal-" + i;
        i++;
        this.show();

        if (this.props.onCreate) {
          this.props.onCreate(this);
        }
      }

      Modal.prototype.createContainerElement = function () {
        var self = this;
        this.element = document.createElement("div");
        this.element.id = this.id;
        this.element.setAttribute("class", "modal " + this.props.modalClass);
        this.element.setAttribute("tabindex", "-1");
        this.element.setAttribute("role", "dialog");
        this.element.setAttribute("aria-labelledby", this.id);
        this.element.innerHTML = '<div class="modal-dialog ' + this.props.modalDialogClass + '" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>' + '<div class="modal-body"></div>' + '<div class="modal-footer"></div>' + '</div>' + '</div>';
        document.body.appendChild(this.element);
        this.titleElement = this.element.querySelector(".modal-title");
        this.bodyElement = this.element.querySelector(".modal-body");
        this.footerElement = this.element.querySelector(".modal-footer");
        $(this.element).on('hidden.bs.modal', function () {
          self.dispose();
        });
        $(this.element).on('shown.bs.modal', function () {
          if (self.props.onShown) {
            self.props.onShown(self);
          }
        });
      };

      Modal.prototype.show = function () {
        if (!this.element) {
          this.createContainerElement();

          if (this.props.options) {
            $(this.element).modal(this.props.options);
          } else {
            $(this.element).modal();
          }
        } else {
          $(this.element).modal('show');
        }

        if (this.props.title) {
          $(this.titleElement).show();
          this.titleElement.innerHTML = this.props.title;
        } else {
          $(this.titleElement).hide();
        }

        if (this.props.body) {
          $(this.bodyElement).show();
          this.bodyElement.innerHTML = this.props.body;
        } else {
          $(this.bodyElement).hide();
        }

        if (this.props.footer) {
          $(this.footerElement).show();
          this.footerElement.innerHTML = this.props.footer;
        } else {
          $(this.footerElement).hide();
        }
      };

      Modal.prototype.hide = function () {
        $(this.element).modal('hide');
      };

      Modal.prototype.dispose = function () {
        $(this.element).modal('dispose');
        document.body.removeChild(this.element);

        if (this.props.onDispose) {
          this.props.onDispose(this);
        }
      };

      $.extend({
        showModal: function (props) {
          if (props.buttons) {
            var footer = "";

            for (var key in props.buttons) {
              // noinspection JSUnfilteredForInLoop
              var buttonText = props.buttons[key];
              footer += '<button type="button" class="btn btn-primary" data-value="' + key + '" data-dismiss="modal">' + buttonText + '</button>';
            }

            props.footer = footer;
          }

          return new Modal(props);
        },
        showAlert: function (props) {
          props.buttons = {
            OK: 'OK'
          };
          return this.showModal(props);
        },
        showConfirm: function (props) {
          props.footer = '<button class="btn btn-secondary btn-false btn-cancel">' + props.textFalse + '</button><button class="btn btn-primary btn-true">' + props.textTrue + '</button>';

          props.onCreate = function (modal) {
            $(modal.element).on("click", ".btn", function (event) {
              event.preventDefault();
              modal.hide();
              modal.props.onSubmit(event.target.getAttribute("class").indexOf("btn-true") !== -1, modal);
            });
          };

          return this.showModal(props);
        }
      });
    })(jQuery);

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class PromotionDialog {
      constructor(props, callback) {
        this.piece = null;
        this.callback = callback;
        let pieceQ = props.color === COLOR.white ? "wq" : "bq";
        let pieceR = props.color === COLOR.white ? "wr" : "br";
        let pieceN = props.color === COLOR.white ? "wn" : "bn";
        let pieceB = props.color === COLOR.white ? "wb" : "bb";
        const title = "Promotion";
        const body = `<div class="container-fluid">
                        <div class="row">
                            <div class="col text-center">
                                <svg class="piece" data-piece="q">
                                    <use data-piece="q" xlink:href="${props.spriteUrl}#${pieceQ}"></use>
                                </svg>
                            </div>
                            <div class="col text-center">
                                <svg class="piece" data-piece="r">
                                    <use data-piece="r" xlink:href="${props.spriteUrl}#${pieceR}"></use>
                                </svg>
                            </div>
                            <div class="col text-center">
                                <svg class="piece" data-piece="n"> 
                                    <use data-piece="n" xlink:href="${props.spriteUrl}#${pieceN}"></use>
                                </svg>
                            </div>
                            <div class="col text-center">
                                <svg class="piece" data-piece="b">
                                    <use data-piece="b" xlink:href="${props.spriteUrl}#${pieceB}"></use>
                                </svg>
                            </div>
                        </div>
                     </div>`;
        $.showModal({
          modalClass: "fade",
          title: title,
          body: body,
          onCreate: modal => {
            $(modal.element).on("click", ".piece", event => {
              modal.piece = event.target.getAttribute("data-piece");
              modal.hide();
            });
            $(modal.element).on("hidden.bs.modal", ignored => {
              this.callback(modal.piece);
            });
          }
        });
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class LocalPlayer extends ChessConsolePlayer {
      constructor(chessConsole, name, props) {
        super(chessConsole, name, props);
      }
      /**
       * The return value returns, if valid or if is promotion.
       * The callback returns the move.
       */


      validateMoveAndPromote(fen, squareFrom, squareTo, callback) {
        const tmpChess = new Chess$1(fen);
        let move = {
          from: squareFrom,
          to: squareTo
        };
        const moveResult = tmpChess.move(move);

        if (moveResult) {
          callback(moveResult);
          return true;
        } else {
          // is a promotion?
          if (tmpChess.get(squareFrom).type === "p") {
            const possibleMoves = tmpChess.moves({
              square: squareFrom,
              verbose: true
            });

            for (let possibleMove of possibleMoves) {
              if (possibleMove.to === squareTo && possibleMove.promotion) {
                new PromotionDialog({
                  color: tmpChess.turn(),
                  spriteUrl: this.chessConsole.props.figuresSpriteFile
                }, piece => {
                  move.promotion = piece;
                  callback(tmpChess.move(move));
                });
                return true;
              }
            }
          }
        }

        callback(null);
        return false;
      }
      /**
       * Handles the events from cm-chessboard
       *
       * INPUT_EVENT_TYPE.moveDone
       * - validates Move, returns false, if not valid
       * - does promotion
       * - calls moveResponse()
       *
       * INPUT_EVENT_TYPE.moveStart
       * - allowed only the right color to move
       */


      moveInputCallback(event, fen, moveResponse) {
        if (event.type === INPUT_EVENT_TYPE.moveDone) {
          return this.validateMoveAndPromote(fen, event.squareFrom, event.squareTo, moveResult => {
            let result;

            if (moveResult) {
              // valid
              result = moveResponse(moveResult);
            } else {
              // not valid
              result = moveResponse({
                from: event.squareFrom,
                to: event.squareTo
              });
            }

            if (result) {
              this.chessConsole.board.chessboard.disableMoveInput();
            }
          });
        } else if (event.type === INPUT_EVENT_TYPE.moveStart) {
          if (this.chessConsole.state.plyViewed !== this.chessConsole.state.chess.plyCount()) {
            this.chessConsole.state.plyViewed = this.chessConsole.state.chess.plyCount();
            return false;
          } else {
            return true;
          }
        }
      }

      moveRequest(fen, moveResponse) {
        const color = this.chessConsole.state.chess.turn() === 'w' ? COLOR.white : COLOR.black;

        if (!this.chessConsole.state.chess.gameOver()) {
          this.chessConsole.board.chessboard.enableMoveInput(event => {
            return this.moveInputCallback(event, fen, moveResponse);
          }, color);
        }
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    const CONSOLE_MARKER_TYPE = {
      moveToMarker: {
        class: "markerFrame",
        slice: "markerFrame"
      },
      moveFromMarker: {
        class: "markerFrame",
        slice: "markerFrame"
      },
      lastMove: {
        class: "markerFrame",
        slice: "markerFrame"
      },
      check: {
        class: "markerCircleRed",
        slice: "markerCircle"
      },
      wrongMove: {
        class: "markerFrameRed",
        slice: "markerFrame"
      }
    };
    class Board extends UiComponent {
      constructor(chessConsole, props) {
        super(chessConsole.componentContainers.board, props);
        this.initialization = new Promise(resolve => {
          chessConsole.board = this;
          this.chessConsole = chessConsole;
          this.elements = {
            playerTop: document.createElement("div"),
            playerBottom: document.createElement("div"),
            chessboard: document.createElement("div")
          };
          this.elements.playerTop.setAttribute("class", "player top");
          this.elements.playerTop.innerHTML = "&nbsp;";
          this.elements.playerBottom.setAttribute("class", "player bottom");
          this.elements.playerBottom.innerHTML = "&nbsp;";
          this.elements.chessboard.setAttribute("class", "chessboard");
          this.context.appendChild(this.elements.playerTop);
          this.context.appendChild(this.elements.chessboard);
          this.context.appendChild(this.elements.playerBottom);
          this.chessConsole.state.observeChess(params => {
            let animated = true;

            if (params.functionName === "load_pgn") {
              animated = false;
            }

            this.setPositionOfPlyViewed(animated);
            this.markLastMove();
          });
          Observe.property(this.chessConsole.state, "plyViewed", () => {
            this.setPositionOfPlyViewed();
            this.markLastMove();
          });
          const chessboardProps = {
            responsive: true,
            position: "empty",
            orientation: chessConsole.state.orientation,
            style: {
              aspectRatio: 0.94,
              moveFromMarker: CONSOLE_MARKER_TYPE.moveFromMarker,
              moveToMarker: CONSOLE_MARKER_TYPE.moveToMarker
            },
            sprite: {
              url: chessConsole.props.figuresSpriteFile
            }
          };

          if (this.props.style) {
            Object.assign(chessboardProps.style, this.props.style);
          }

          this.chessboard = new Chessboard(this.elements.chessboard, chessboardProps);
          /**/

          var flag = false;
          $('#console-container').on('click', '#flip_board', () => {
            this.chessboard.setOrientation(this.chessboard.getOrientation() === 'w' ? 'b' : 'w');

            if (flag) {
              $('.chess-console-board').removeClass('reverse');
              flag = false;
            } else {
              $('.chess-console-board').addClass('reverse');
              flag = true;
            }
          });
          /**/

          this.chessboard.view.drawMarkers = function () {
            // noinspection JSUnresolvedVariable
            clearTimeout(this.drawMarkersDebounce);
            this.drawMarkersDebounce = setTimeout(() => {
              while (this.markersGroup.firstChild) {
                this.markersGroup.removeChild(this.markersGroup.firstChild);
              }

              this.chessboard.state.markers.forEach(marker => {
                this.drawMarker(marker);
              });
            });
          };

          Observe.property(chessConsole.state, "orientation", () => {
            this.setPlayerNames();
            this.chessboard.setOrientation(chessConsole.state.orientation);
            this.markPlayerToMove();
          });
          Observe.property(chessConsole.player, "name", () => {
            this.setPlayerNames();
          });
          Observe.property(chessConsole.opponent, "name", () => {
            this.setPlayerNames();
          });
          chessConsole.messageBroker.subscribe(consoleMessageTopics.moveRequest, () => {
            this.markPlayerToMove();
          });
          this.chessConsole.messageBroker.subscribe(consoleMessageTopics.illegalMove, message => {
            if (message.move.from) {
              this.chessboard.addMarker(message.move.from, CONSOLE_MARKER_TYPE.wrongMove);
            } else {
              console.warn("illegalMove without `message.move.from`");
            }

            if (message.move.to) {
              this.chessboard.addMarker(message.move.to, CONSOLE_MARKER_TYPE.wrongMove);
            }

            setTimeout(() => {
              this.chessboard.removeMarkers(undefined, CONSOLE_MARKER_TYPE.wrongMove);
            }, 500);
          });
          this.setPositionOfPlyViewed(false);
          this.setPlayerNames();
          this.markPlayerToMove();
          resolve(this);
        });
      }

      setPositionOfPlyViewed(animated = true) {
        clearTimeout(this.setPositionOfPlyViewedDebounced);
        this.setPositionOfPlyViewedDebounced = setTimeout(() => {
          const to = this.chessConsole.state.chess.fenOfPly(this.chessConsole.state.plyViewed);
          this.chessboard.setPosition(to, animated).then(() => {
            // TODO workaround, fix Promise
            this.chessboard.removeMarkers(undefined, CONSOLE_MARKER_TYPE.moveFromMarker);
            this.chessboard.removeMarkers(undefined, CONSOLE_MARKER_TYPE.moveToMarker);
          });
        });
      }

      markLastMove() {
        window.clearTimeout(this.markLastMoveDebounce);
        this.markLastMoveDebounce = setTimeout(() => {
          this.chessboard.removeMarkers(undefined, CONSOLE_MARKER_TYPE.lastMove);
          this.chessboard.removeMarkers(undefined, CONSOLE_MARKER_TYPE.check);

          if (this.chessConsole.state.plyViewed === this.chessConsole.state.chess.plyCount()) {
            const lastMove = this.chessConsole.state.chess.lastMove();

            if (lastMove) {
              this.chessboard.addMarker(lastMove.from, CONSOLE_MARKER_TYPE.lastMove);
              this.chessboard.addMarker(lastMove.to, CONSOLE_MARKER_TYPE.lastMove);
            }

            if (this.chessConsole.state.chess.inCheck() || this.chessConsole.state.chess.inCheckmate()) {
              const kingSquare = this.chessConsole.state.chess.pieces("k", this.chessConsole.state.chess.turn())[0];
              this.chessboard.addMarker(kingSquare.square, CONSOLE_MARKER_TYPE.check);
            }
          }
        });
      }

      setPlayerNames() {
        window.clearTimeout(this.setPlayerNamesDebounce);
        this.setPlayerNamesDebounce = setTimeout(() => {
          if (this.chessConsole.props.playerColor === this.chessConsole.state.orientation) {
            this.elements.playerBottom.innerHTML = this.chessConsole.player.name;
            this.elements.playerTop.innerHTML = this.chessConsole.opponent.name;
          } else {
            this.elements.playerBottom.innerHTML = this.chessConsole.opponent.name;
            this.elements.playerTop.innerHTML = this.chessConsole.player.name;
          }
        });
      }

      markPlayerToMove() {
        clearTimeout(this.markPlayerToMoveDebounce);
        this.markPlayerToMoveDebounce = setTimeout(() => {
          this.elements.playerTop.classList.remove("to-move");
          this.elements.playerBottom.classList.remove("to-move");
          const playerMove = this.chessConsole.playerToMove();

          if (this.chessConsole.state.orientation === COLOR.white && playerMove === this.chessConsole.playerWhite() || this.chessConsole.state.orientation === COLOR.black && playerMove === this.chessConsole.playerBlack()) {
            this.elements.playerBottom.classList.add("to-move");
          } else {
            this.elements.playerTop.classList.add("to-move");
          }
        }, 10);
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-chess
     * License: MIT, see file 'LICENSE'
     *
     * @deprecated
     */
    const PIECES = {
      // https://en.wikipedia.org/wiki/Chess_piece_relative_value
      notation: {
        de: {
          R: "T",
          N: "S",
          B: "L",
          Q: "D",
          K: "K",
          P: ""
        }
      },
      figures: {
        utf8: {
          Rw: "♖",
          Nw: "♘",
          Bw: "♗",
          Qw: "♕",
          Kw: "♔",
          Pw: "♙",
          Rb: "♜",
          Nb: "♞",
          Bb: "♝",
          Qb: "♛",
          Kb: "♚",
          Pb: "♟"
        },
        fontAwesomePro: {
          Rw: '<i class="far fa-fw fa-chess-rook"></i>',
          Nw: '<i class="far fa-fw fa-chess-knight"></i>',
          Bw: '<i class="far fa-fw fa-chess-bishop"></i>',
          Qw: '<i class="far fa-fw fa-chess-queen"></i>',
          Kw: '<i class="far fa-fw fa-chess-king"></i>',
          Pw: '<i class="far fa-fw fa-chess-pawn"></i>',
          Rb: '<i class="fas fa-fw fa-chess-rook"></i>',
          Nb: '<i class="fas fa-fw fa-chess-knight"></i>',
          Bb: '<i class="fas fa-fw fa-chess-bishop"></i>',
          Qb: '<i class="fas fa-fw fa-chess-queen"></i>',
          Kb: '<i class="fas fa-fw fa-chess-king"></i>',
          Pb: '<i class="fas fa-fw fa-chess-pawn"></i>'
        }
      }
    }; // noinspection JSUnusedGlobalSymbols

    class ChessRender {
      static san(san, color = COLOR$1.white, lang = "en", mode = "text", pieces = PIECES.figures.utf8) {
        // console.warn("ChessRender is deprecated and will be removed in future")
        if (mode === "figures") {
          if (color === COLOR$1.white) {
            return this.replaceAll(san, {
              "R": pieces.Rw,
              "N": pieces.Nw,
              "B": pieces.Bw,
              "Q": pieces.Qw,
              "K": pieces.Kw
            });
          } else {
            return this.replaceAll(san, {
              "R": pieces.Rb,
              "N": pieces.Nb,
              "B": pieces.Bb,
              "Q": pieces.Qb,
              "K": pieces.Kb
            });
          }
        } else if (mode === "text") {
          return this.replaceAll(san, PIECES.notation[lang]);
        } else {
          console.error("mode must be 'text' or 'figures'");
        }
      }

      static replaceAll(str, replacementsObj, ignoreCase = false) {
        let retStr = str;
        const flags = ignoreCase ? "gi" : "g";

        for (let needle in replacementsObj) {
          // noinspection JSUnfilteredForInLoop
          retStr = retStr.replace(new RegExp(needle, flags), replacementsObj[needle]);
        }

        return retStr;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class History extends UiComponent {
      constructor(chessConsole, props) {
        super(chessConsole.componentContainers.left, props);
        this.chessConsole = chessConsole;
        this.element = document.createElement("div");
        this.element.setAttribute("class", "history");
        this.context.appendChild(this.element);
        this.props = {
          notationType: "figures",
          makeClickable: false
        };
        Object.assign(this.props, props);
        this.chessConsole.state.observeChess(() => {
          this.redraw();
        });
        Observe.property(chessConsole.state, "plyViewed", () => {
          this.redraw();
        });

        if (this.props.makeClickable) {
          this.addClickEvents();
        }

        this.redraw();
      }

      addClickEvents() {
        this.clickHandler = DomUtils.delegate(this.element, "click", ".ply", event => {
          const ply = parseInt(event.target.getAttribute("data-ply"), 10);

          if (ply <= this.chessConsole.state.chess.history().length) {
            this.chessConsole.state.plyViewed = ply;
          }
        });
        this.element.classList.add("clickable");
      }

      removeClickEvents() {
        this.clickHandler.remove();
        this.element.classList.remove("clickable");
      }

      redraw() {
        window.clearTimeout(this.redrawDebounce);
        this.redrawDebounce = setTimeout(() => {
          const history = this.chessConsole.state.chess.history();
          let sanWhite;
          let sanBlack;
          let output = "";
          let i;
          let rowClass = "";
          let whiteClass = "";
          let blackClass = "";

          for (i = 0; i < history.length; i += 2) {
            const moveWhite = history[i];

            if (moveWhite) {
              sanWhite = ChessRender.san(moveWhite.san, COLOR$1.white, this.chessConsole.i18n.lang, this.props.notationType, this.chessConsole.props.figures);
            }

            const moveBlack = history[i + 1];

            if (moveBlack) {
              sanBlack = ChessRender.san(moveBlack.san, COLOR$1.black, this.chessConsole.i18n.lang, this.props.notationType, this.chessConsole.props.figures);
            } else {
              sanBlack = "";
            }

            if (this.chessConsole.state.plyViewed < i + 1) {
              whiteClass = "text-muted";
            }

            if (this.chessConsole.state.plyViewed === i + 1) {
              whiteClass = "active";
            }

            if (this.chessConsole.state.plyViewed < i + 2) {
              blackClass = "text-muted";
            }

            if (this.chessConsole.state.plyViewed === i + 2) {
              blackClass = "active";
            }

            output += "<tr><td class='num " + rowClass + "'>" + (i / 2 + 1) + ".</td><td data-ply='" + (i + 1) + "' class='ply " + whiteClass + " ply" + (i + 1) + "'>" + sanWhite + "</td><td data-ply='" + (i + 2) + "' class='ply " + blackClass + " ply" + (i + 2) + "'>" + sanBlack + "</td></tr>";
          }

          this.element.innerHTML = "<table>" + output + "</table>";

          if (this.chessConsole.state.plyViewed > 0) {
            const $ply = $(this.element).find('.ply' + this.chessConsole.state.plyViewed);

            if ($ply.position()) {
              this.element.scrollTop = 0;
              this.element.scrollTop = $ply.position().top - 68;
            }
          }
        });
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class CapturedPieces extends UiComponent {
      constructor(chessConsole) {
        super(chessConsole);
        this.chessConsole = chessConsole;
        this.element = document.createElement("div");
        this.element.setAttribute("class", "captured-pieces");
        this.chessConsole.componentContainers.left.appendChild(this.element);
        this.chessConsole.state.observeChess(() => {
          this.redraw();
        });
        Observe.property(this.chessConsole.state, "plyViewed", () => {
          this.redraw();
        });
        this.redraw();
      }

      redraw() {
        window.clearTimeout(this.redrawDebounce);
        this.redrawDebounce = setTimeout(() => {
          const capturedPiecesWhite = [];
          const capturedPiecesWhiteAfterPlyViewed = [];
          const capturedPiecesBlack = [];
          const capturedPiecesBlackAfterPlyViewed = [];
          const history = this.chessConsole.state.chess.history({
            verbose: true
          });
          let pointsWhite = 0;
          let pointsBlack = 0;
          $.each(history, (index, move) => {
            if (move.flags.indexOf("c") !== -1 || move.flags.indexOf("e") !== -1) {
              const pieceCaptured = move.captured.toUpperCase();

              if (move.color === "b") {
                if (index < this.chessConsole.state.plyViewed) {
                  capturedPiecesWhite.push(this.chessConsole.props.figures[pieceCaptured + "w"]);
                } else {
                  capturedPiecesWhiteAfterPlyViewed.push(this.chessConsole.props.figures[pieceCaptured + "w"]);
                }

                pointsWhite += PIECES$1[pieceCaptured.toLowerCase()].value;
              } else if (move.color === "w") {
                if (index < this.chessConsole.state.plyViewed) {
                  capturedPiecesBlack.push(this.chessConsole.props.figures[pieceCaptured + "b"]);
                } else {
                  capturedPiecesBlackAfterPlyViewed.push(this.chessConsole.props.figures[pieceCaptured + "b"]);
                }

                pointsBlack += PIECES$1[pieceCaptured.toLowerCase()].value;
              }
            }
          });

          if (pointsWhite === 0) {
            pointsWhite = "";
          }

          if (pointsBlack === 0) {
            pointsBlack = "";
          }

          const zeroWithSpace = "&#8203;";
          let output = "<div>";

          if (capturedPiecesWhite.length > 0) {
            output += capturedPiecesWhite.join(zeroWithSpace); // Zero width Space
          }

          if (capturedPiecesWhiteAfterPlyViewed.length > 0) {
            output += "<span class='text-muted'>" + capturedPiecesWhiteAfterPlyViewed.join(zeroWithSpace) + "</span>";
          }

          output += "<small> " + pointsWhite + "</small></div><div>";

          if (capturedPiecesBlack.length > 0) {
            output += capturedPiecesBlack.join("&#8203;");
          }

          if (capturedPiecesBlackAfterPlyViewed.length > 0) {
            output += "<span class='text-muted'>" + capturedPiecesBlackAfterPlyViewed.join(zeroWithSpace) + "</span>";
          }

          output += "<small> " + pointsBlack + "</small></div>";
          this.element.innerHTML = output;
        });
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class Persistence extends Component {
      constructor(chessConsole, props) {
        super(props);
        this.chessConsole = chessConsole;

        if (!this.props.savePrefix) {
          this.props.savePrefix = "ChessConsole";
        }

        this.chessConsole.state.observeChess(() => {
          this.save();
        });
        this.chessConsole.persistence = this;
      }

      load(prefix = this.props.savePrefix) {
        const props = {};

        try {
          if (this.loadValue("PlayerColor") !== null) {
            props.playerColor = this.loadValue("PlayerColor");
          } else {
            props.playerColor = COLOR$1.white;
          }

          if (localStorage.getItem(prefix + "Pgn") !== null) {
            props.pgn = localStorage.getItem(prefix + "Pgn");
          }

          this.chessConsole.messageBroker.publish(consoleMessageTopics.load);
          this.chessConsole.initGame(props);
        } catch (e) {
          localStorage.clear();
          console.warn(e);
          this.chessConsole.initGame({
            playerColor: COLOR$1.white
          });
        }
      }

      loadValue(valueName, prefix = this.props.savePrefix) {
        let item = null;

        try {
          item = localStorage.getItem(prefix + valueName);
          return JSON.parse(item);
        } catch (e) {
          console.error("error loading ", prefix + valueName);
          console.error("item:" + item);
          console.error(e);
        }
      }

      save(prefix = this.props.savePrefix) {
        localStorage.setItem(prefix + "PlayerColor", JSON.stringify(this.chessConsole.props.playerColor));
        localStorage.setItem(prefix + "Pgn", this.chessConsole.state.chess.renderPgn());
      }

      saveValue(valueName, value, prefix = this.props.savePrefix) {
        localStorage.setItem(prefix + valueName, JSON.stringify(value));
      }

    }

    // noinspection JSUnresolvedVariable

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    const desiredSampleRate = 44100; // ios safari fix from https://github.com/Jam3/ios-safe-audio-context

    let audioContext = new AudioContext();
    const mainGainNode = audioContext.createGain();
    mainGainNode.gain.value = 1;
    mainGainNode.connect(audioContext.destination);

    if (/(iPhone|iPad)/i.test(navigator.userAgent) && audioContext.sampleRate !== desiredSampleRate) {
      const buffer = audioContext.createBuffer(1, 1, desiredSampleRate);
      const sound = audioContext.createBufferSource();
      sound.buffer = buffer;
      sound.connect(audioContext.destination);
      sound.start(0);
      sound.disconnect();
      audioContext.close().then(() => {
        audioContext = new AudioContext();
        mainGainNode.connect(audioContext.destination);
      });
    } // start context after user interaction


    const resumeAudio = function () {
      if (audioContext.state !== "running") {
        document.removeEventListener("mousedown", resumeAudio);
        return audioContext.resume();
      }
    };

    document.addEventListener("mousedown", resumeAudio);
    class Audio {
      static context() {
        return audioContext;
      }

      static destination() {
        return mainGainNode;
      }

      static setGain(gain) {
        mainGainNode.gain.setValueAtTime(gain, audioContext.currentTime);
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class Sample {
      constructor(src, props = {}) {
        this.src = src;
        this.props = {
          gain: 1
        };
        Object.assign(this.props, props);
        this.gainNode = Audio.context().createGain();
        this.setGain(this.props.gain);
        this.audioBuffer = null;
        this.load();
      }

      setGain(gain) {
        this.gainNode.gain.setValueAtTime(gain, Audio.context().currentTime);
      }

      play(when = undefined, offset = undefined, duration = undefined) {
        this.loading.then(() => {
          let source;
          source = this.createBufferSource();
          source.start(when, offset, duration);
        });
      }

      createBufferSource() {
        const source = Audio.context().createBufferSource();
        source.buffer = this.audioBuffer;
        source.connect(this.gainNode);
        this.gainNode.connect(Audio.destination());
        return source;
      }

      load() {
        this.loading = new Promise((resolve, reject) => {
          const request = new XMLHttpRequest();
          request.open('GET', this.src, true);
          request.responseType = 'arraybuffer';

          request.onload = () => {
            Audio.context().decodeAudioData(request.response, audioBuffer => {
              this.audioBuffer = audioBuffer;
              resolve();
            }, () => {
              console.error("error loading sound", this.src);
              reject();
            });
          };

          request.send();
        });
        return this.loading;
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/cm-web-modules
     * License: MIT, see file 'LICENSE'
     */
    class AudioSprite extends Sample {
      play(sliceName, when = 0) {
        const slice = this.props.slices[sliceName];

        if (!slice) {
          throw new Error(`slice ${sliceName} not found in sprite`);
        }

        super.play(when, slice.offset, slice.duration);
      }

    }

    /**
     * Author and copyright: Stefan Haack (https://shaack.com)
     * Repository: https://github.com/shaack/chess-console
     * License: MIT, see file 'LICENSE'
     */
    class Sound extends Component {
      constructor(chessConsole, props) {
        super(props);
        this.chessConsole = chessConsole;
        this.audioSprite = new AudioSprite(this.props.soundSpriteFile, {
          gain: 1,
          slices: {
            "game_start": {
              offset: 0,
              duration: 0.9
            },
            "game_won": {
              offset: 0.9,
              duration: 1.8
            },
            "game_lost": {
              offset: 2.7,
              duration: 0.9
            },
            "game_draw": {
              offset: 9.45,
              duration: 1.35
            },
            "check": {
              offset: 3.6,
              duration: 0.45
            },
            "wrong_move": {
              offset: 4.05,
              duration: 0.45
            },
            "move": {
              offset: 4.5,
              duration: 0.2
            },
            "capture": {
              offset: 6.3,
              duration: 0.2
            },
            "castle": {
              offset: 7.65,
              duration: 0.2
            },
            "take_back": {
              offset: 8.1,
              duration: 0.12
            },
            "promotion": {
              offset: 9.0,
              duration: 0.45
            },
            "dialog": {
              offset: 10.8,
              duration: 0.45
            }
          }
        });
        chessConsole.messageBroker.subscribe(consoleMessageTopics.initGame, () => {// this.play("game_start")
        });
        chessConsole.messageBroker.subscribe(consoleMessageTopics.legalMove, data => {
          const chess = this.chessConsole.state.chess;
          const flags = data.moveResult.flags;

          if (flags.indexOf("p") !== -1) {
            this.play("promotion");
          } else if (flags.indexOf("c") !== -1) {
            this.play("capture");
          } else if (flags.indexOf("k") !== -1 || flags.indexOf("q") !== -1) {
            this.play("castle");
          } else {
            this.play("move");
          }

          if (chess.inCheck() || chess.inCheckmate()) {
            this.play("check");
          }
        });
        chessConsole.messageBroker.subscribe(consoleMessageTopics.illegalMove, () => {
          this.play("wrong_move");
        });
        chessConsole.messageBroker.subscribe(consoleMessageTopics.moveUndone, () => {
          this.play("take_back");
        });
        chessConsole.messageBroker.subscribe(consoleMessageTopics.gameOver, data => {
          setTimeout(() => {
            if (!data.wonColor) {
              this.play("game_lost");
            } else {
              if (data.wonColor === this.chessConsole.props.playerColor) {
                this.play("game_won");
              } else {
                this.play("game_lost");
              }
            }
          }, 500);
        });
        chessConsole.sound = this;
      }

      play(soundName) {
        this.audioSprite.play(soundName);
      }

    }

    class Timer {
      constructor(_time, tick) {
        this.tid = null;
        this.originalTime = _time;
        this.time = _time * 60;
        this.tick = tick;
        this.endHandler = null;
        this.settime = null;
        this.str = `${Math.trunc(this.time / 60 % 60)}:${this.time % 60}0`;
        this.tick(this.str);
      }

      start() {
        this.tid = setInterval(() => {
          let min = this.time / 60 % 60;
          let sec = this.time % 60;

          if (this.time <= 0) {
            clearInterval(this.tid);
            this.endHandler();
          }

          if (min === 0 && String(sec).length === 1) {
            this.str = `${Math.trunc(min)}:${sec}0`;
          } else if (String(sec).length === 1) {
            this.str = `${Math.trunc(min)}:${sec}0`;
          } else {
            this.str = `${Math.trunc(min)}:${sec}`;
          }

          this.tick(this.str);
          --this.time;
        }, 1000);
      }

      onEnd(endHandler) {
        this.endHandler = endHandler;
      }

      stop() {
        clearInterval(this.tid);
      }

      reset() {
        this.stop();
        this.time = (this.settime || this.originalTime) * 60;
        return this.time;
      }

      set(_time) {
        this.settime = _time;
        this.time = _time * 60;
      }

    }

    new ChessConsole(document.getElementById("console-container"), {
      name: "Игрок 1",
      type: LocalPlayer
    }, {
      name: "Игрок 2",
      type: LocalPlayer
    }, {
      figuresSpriteFile: "./assets/chessboard-sprite-staunty.svg"
    }).initialization.then(chessConsole => {
      new Board(chessConsole).initialization.then(() => {
        new Persistence(chessConsole, {
          savePrefix: "Local"
        }).load();
      });
      new History(chessConsole, {
        notationType: "figures"
      });
      new CapturedPieces(chessConsole);
      new Sound(chessConsole, {
        soundSpriteFile: "./assets/sounds/chess.mp3"
      });
    });
    /**
     * TIMERS
     */

    const $timerTpl = $(`<div class="chess-timer">
            <div class="chess-timer__btn-wrapper">
                <div class="chess-timer__player chess-timer__player--1"></div>
                <div class="chess-timer__player chess-timer__player--2"></div>
            </div>

        </div>`);
    $('.chess-console-left').append($timerTpl);
    var gameTime = 10;
    $('.modal__close').on('click', function () {
      $('.modal').hide();
    });

    function notify(msg) {
      $('.modal__msg').html(msg);
      $('.modal').css('display', 'flex');
    }
    /**
     * NEW GAME
     */
    //add btn 


    let $tpl = `

    <div class="game__control">
 
                <div id="flip_board"><i class="fas fa-adjust"></i></div>
                
                <div class="number-input">
                  <button id="minus" ></button>
                  <input class="quantity" type="number" id="timer__value"  min="1" max="60" value="10" step="1">
                  <button  id="plus" class="plus"></button>
                </div>

    </div>
     <div id="new_game">Новая игра</div>
`;
    $('.chess-console-left').append($tpl);
    $('#new_game').on('mousedown', function () {
      localStorage.clear();
      location.reload();
    });
    var playerClick1 = false;
    var playerClick2 = false;
    var t1 = new Timer(gameTime, function (time) {
      $('.chess-timer__player--1').html(time);
    });
    t1.onEnd(() => {
      notify("Время закончилось");
    });
    var t2 = new Timer(gameTime, function (time) {
      $('.chess-timer__player--2').html(time);
    });
    t2.onEnd(() => {
      notify("Время закончилось");
    });
    setTimeout(() => {
      console.log(t2.str);
    }, 4000);
    /**/

    var _gameTime = null;

    function changeTimerHandler(data) {
      _gameTime = data;
      t1.stop();
      t2.stop();
      t1.set(_gameTime);
      t2.set(_gameTime);
      playerClick1 = false;
      playerClick2 = false;
      $('.chess-timer__player--1').html(_gameTime + ':00').removeClass('active-timer');
      $('.chess-timer__player--2').html(_gameTime + ':00').removeClass('active-timer');
    }

    $('#timer__value').on('change', function () {
      changeTimerHandler(Number($(this).val()));
    });
    $('#console-container').on('click', '#minus', function () {
      this.parentNode.querySelector('input[type=number]').stepDown();
      changeTimerHandler(Number($('input[type=number]').val()));
    });
    $('#console-container').on('click', '#plus', function () {
      this.parentNode.querySelector('input[type=number]').stepUp();
      changeTimerHandler(Number($('input[type=number]').val()));
    });
    /*reset*/

    $('.chess-timer__control .fa-redo-alt').on('mousedown', function () {
      $('.chess-timer__player--1').html(t1.reset()).removeClass('active-timer');
      $('.chess-timer__player--2').html(t2.reset()).removeClass('active-timer');
      playerClick1 = false;
      playerClick2 = false;
    });
    /*
     * Player 1
     */

    $('.chess-timer__player--1').on('mousedown', function () {
      if (playerClick1) {
        playerClick1 = false;
        t1.stop();
        $(this).removeClass('active-timer');
      } else {
        playerClick1 = true;
        t1.start();
        t2.stop();
        playerClick2 = false;
        $('.chess-timer__player--2').removeClass('active-timer');
        $(this).addClass('active-timer');
      }
    });
    /*
     * Player 2
     */

    $('.chess-timer__player--2').on('mousedown', function () {
      if (playerClick2) {
        playerClick2 = false;
        t2.stop();
        $(this).removeClass('active-timer');
      } else {
        playerClick2 = true;
        t1.stop();
        playerClick1 = false;
        $('.chess-timer__player--1').removeClass('active-timer');
        t2.start();
        $(this).addClass('active-timer');
      }
    });
    $('#console-container').on('mousedown', '.chess-console-board .top', function () {
      try {
        window.mcefQuery({
          request: "info",
          persistent: true,
          onSuccess: response => {
            var player = JSON.parse(response);
            this.innerHTML = player.name;
          }
        });
      } catch (err) {
        this.innerHTML = 'mcap_uknown';
      }
    });
    $('#console-container').on('mousedown', '.chess-console-board .bottom', function () {
      try {
        window.mcefQuery({
          request: "info",
          persistent: true,
          onSuccess: response => {
            var player = JSON.parse(response);
            this.innerHTML = player.name;
          }
        });
      } catch (err) {
        this.innerHTML = 'mcap_uknown';
      }
    });

})();
