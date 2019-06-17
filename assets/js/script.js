"use strict";
(function () {
    var quixel = {
        answer: [],
        domChangeSizeBtnSelector: "#changeSize",
        domTableSelector: "#table",
        domTableSizeSelector: "#numRowCol",
        generateExpectedAnswer: function () {
            this.answer = [];
            for (var i = 0; i < this.tableSize; i++) {
                this.answer.push([]);
                for (var x = 0; x < this.tableSize; x++) {
                    this.answer[i].push(Math.random() > 0.2)
                }
            }

            this.generateHints();
            return this;
        },
        generateHints: function () {
            var continuosColumn = 0;
            var continuosRow = 0
            var columnHints = "";
            var rowHints = "";
            for (var row = 0; row < this.tableSize; row++) {
                for (var column = 0; column < this.tableSize; column++) {
                    //Horizontal hints
                    if (this.answer[row][column]) {
                        continuosColumn++;
                    } else {
                        if (continuosColumn != 0) columnHints += " " + continuosColumn;
                        continuosColumn = 0;
                    }

                    //Vertical hints
                    if (this.answer[column][row]) {
                        continuosRow++;
                    } else {
                        if (continuosRow != 0) rowHints += " " + continuosRow;
                        continuosRow = 0;
                    }
                }
                if (continuosColumn != 0) columnHints += " " + continuosColumn;
                if (continuosRow != 0) rowHints += " " + continuosRow;
                continuosColumn = 0;
                continuosRow = 0;
                columnHints += ","
                rowHints += ","
            }
            this.hints = (rowHints + columnHints).split(",");
            this.hints.pop();
            console.log(this.hints)
        },
        generateTable: function () {
            var self = this;
            var tableHtml = "<table>";
            for (var row = 0; row < this.tableSize + 1; row++) {
                tableHtml += "<tr>";
                for (var column = 0; column < this.tableSize + 1; column++) {
                    if (row === 0 || column === 0) {
                        tableHtml += `<td></td>`
                    } else {
                        tableHtml += `<td row="${row-1}" column="${column-1}"></td>`
                    }
                }
                tableHtml += "</tr>";
            }
            tableHtml += "</table>"
            $(this.domTableSelector).html(tableHtml);
            $("table td:not([row])").each(function (index) {
                if (index != 0) {
                    this.innerHTML = self.hints[index - 1]
                }
            })
        },
        hints: [],
        init: function () {
            this.newGame();
            this.injectEventHandlers();
        },
        injectChangeSizeBtnEvent: function () {
            var self = this;
            $(this.domChangeSizeBtnSelector).on("click", function () {
                self.setTableSize();
            })
        },
        injectClickCellsEvent: function () {
            var self = this;
            $("#table").on("click", "td", function () {
                var row = $(this).attr("row");
                var column = $(this).attr("column");
                if (row && column && self.answer[row][column]) {
                    console.log(self.answer)
                    console.log(row)
                    console.log(column)
                    $(this).css("background", "red")
                }
            })
        },
        injectEventHandlers: function () {
            this.injectChangeSizeBtnEvent();
            this.injectClickCellsEvent();
        },
        newGame: function () {
            this
                .generateExpectedAnswer()
                .generateTable()
        },
        setTableSize: function () {
            var size = document.querySelector(this.domTableSizeSelector).value;
            this.tableSize = isNaN(size) || size < 5 ? 5 : parseInt(size);
            $(this.domTableSizeSelector).val(size);
            this.newGame();
        },
        tableSize: 5
    }
    quixel.init();
})()
