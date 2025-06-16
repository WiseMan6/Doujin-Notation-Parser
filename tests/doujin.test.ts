import { describe, expect, test } from 'bun:test';
import { parseFilename, type ScopeType } from "../index";

function bare(value: TemplateStringsArray) {
    return { type: "Bare" as ScopeType, value: value[0] }
}
function square(value: TemplateStringsArray) {
    return { type: "Square" as ScopeType, value: value[0] }
}
function curly(value: TemplateStringsArray) {
    return { type: "Curly" as ScopeType, value: value[0] }
}

const $ = parseFilename;


describe("Synthetical", () => {
    describe("Untagged", () => {
        describe("Orphans", () => {
            test("Simple", () => {
                expect($("normal title")).toEqual({ Title: "normal title" });
                expect($("normal title(2)")).toEqual({ Title: "normal title(2)" });
                expect($("normal title (Color)")).toEqual({ Title: "normal title (Color)" });
                expect($("normal title(2) (Color)")).toEqual({ Title: "normal title(2) (Color)" });
            });

            test("Complex", () => {
                expect($("Definitely (not) a (complex) title")).toEqual({
                    Title: "Definitely (not) a (complex) title"
                });
                expect($("Definitely (not) a (complex) title(2)")).toEqual({
                    Title: "Definitely (not) a (complex) title(2)"
                });
                expect($("Definitely (not) a (complex) title (Color)")).toEqual({
                    Title: "Definitely (not) a (complex) title (Color)"
                });
                expect($("Definitely (not) a (complex) title(2) (Color)")).toEqual({
                    Title: "Definitely (not) a (complex) title(2) (Color)"
                });
            });

            test("Complex 2", () => {
                expect($("(I'm) definitely (not) a (complex) title")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title"
                });
                expect($("(I'm) definitely (not) a (complex) title(2)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2)"
                });
                expect($("(I'm) definitely (not) a (complex) title (Color)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title (Color)"
                });
                expect($("(I'm) definitely (not) a (complex) title(2) (Color)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2) (Color)"
                });
            });
        });


        describe("+ Artists", () => {
            test("Simple", () => {
                expect($("[Artist & Artist #2] normal title")).toEqual({
                    Title: "normal title",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] normal title(2)")).toEqual({
                    Title: "normal title(2)",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] normal title (Color)")).toEqual({
                    Title: "normal title (Color)",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] normal title(2) (Color)")).toEqual({
                    Title: "normal title(2) (Color)",
                    Artists: ["Artist", "Artist #2"]
                });
            });

            test("Complex", () => {
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title")).toEqual({
                    Title: "Definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title(2)")).toEqual({
                    Title: "Definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title (Color)")).toEqual({
                    Title: "Definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title(2) (Color)")).toEqual({
                    Title: "Definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist #2"]
                });
            });

            test("Complex 2", () => {
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title(2)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title (Color)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist #2"]
                });
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title(2) (Color)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist #2"]
                });
            });
        });


        describe("+ Artists & Circles", () => {
            test("Simple", () => {
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title")).toEqual({
                    Title: "normal title",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"]
                });
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title(2)")).toEqual({
                    Title: "normal title(2)",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"]
                });
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title (Color)")).toEqual({
                    Title: "normal title (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"]
                });
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title(2) (Color)")).toEqual({
                    Title: "normal title(2) (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"]
                });
            });

            test("Complex", () => {
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title")).toEqual({
                    Title: "Definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title(2)")).toEqual({
                    Title: "Definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title (Color)")).toEqual({
                    Title: "Definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title(2) (Color)")).toEqual({
                    Title: "Definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
            });

            test("Complex 2", () => {
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title (Color)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2) (Color)")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"]
                });
            });
        });
    });


    describe("Tagged", () => {
        describe("Orphans", () => {
            test("Simple", () => {
                expect($("normal title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("normal title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title(2)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("normal title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title (Color)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("normal title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title(2) (Color)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });

            test("Complex", () => {
                expect($("Definitely (not) a (complex) title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("Definitely (not) a (complex) title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title(2)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("Definitely (not) a (complex) title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title (Color)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("Definitely (not) a (complex) title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title(2) (Color)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });

            test("Complex 2", () => {
                expect($("(I'm) definitely (not) a (complex) title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("(I'm) definitely (not) a (complex) title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("(I'm) definitely (not) a (complex) title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title (Color)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("(I'm) definitely (not) a (complex) title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2) (Color)",
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });
        });


        describe("+ Artists", () => {
            test("Simple", () => {
                expect($("[Artist & Artist #2] normal title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] normal title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title(2)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] normal title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] normal title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title(2) (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });

            test("Complex", () => {
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] Definitely (not) a (complex) title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });

            test("Complex 2", () => {
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Artist & Artist #2] (I'm) definitely (not) a (complex) title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });
        });


        describe("+ Artists & Circles", () => {
            test("Simple", () => {
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title(2)",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle #2 (Artist & Artist #2)] normal title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "normal title(2) (Color)",
                    Artists: ["Artist", "Artist #2"],
                    Circles: ["Circle", "Circle #2"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });

            test("Complex", () => {
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "Definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });

            test("Complex 2", () => {
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
                expect($("[Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2) (Color) (tag1) [tag2] {tag3}")).toEqual({
                    Title: "(I'm) definitely (not) a (complex) title(2) (Color)",
                    Artists: ["Artist", "Artist (2)"],
                    Circles: ["Circle", "Circle(2)"],
                    Tail: [
                        bare `tag1`,
                        square `tag2`,
                        curly `tag3`
                    ]
                });
            });
        });
    });
});
