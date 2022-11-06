
import React from "react";
import "@testing-library/jest-dom/extend-expect";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        state: {paintingId:"1"}
    })
}));

//https://robertmarshall.dev/blog/how-to-mock-local-storage-in-jest-tests/
const localStorageMock = (function () {
    let store = {};

    return {
        getItem(key) {
            return store[key];
        },

        setItem(key, value) {
            store[key] = value;
        },

        clear() {
            store = {};
        },

        removeItem(key) {
            delete store[key];
        },

        getAll() {
            return store;
        },
    };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock })


const setLocalStorage = (id, data) => {
    window.localStorage.setItem(id, JSON.stringify(data));
};




describe("Set local storage item", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    test("data is added into local storage", () => {
        const mockId = "111";
        const mockJson = { data: "json data" };
        setLocalStorage(mockId, mockJson);
        expect(localStorage.getItem(mockId)).toEqual(JSON.stringify(mockJson));
    });

    test("data in local storage which is overwritten", () => {
        const mockId = "222";
        const mockOldData = { data: "json data" };
        const mockNewData = { data: " new data" };

        window.localStorage.setItem(mockId, JSON.stringify(mockOldData));
        expect(localStorage.getItem(mockId)).toEqual(JSON.stringify(mockOldData));

        setLocalStorage(mockId, mockNewData);
        window.localStorage.setItem(mockId, JSON.stringify(mockNewData));
    });

    test("only one ID is in localStorage", () => {
        const mockId = "333";
        const mockOldData = { data: "json data" };
        const mockNewData = { data: " new data" };

        window.localStorage.setItem(mockId, JSON.stringify(mockOldData));
        setLocalStorage(mockId, mockNewData);

        const allItems = window.localStorage.getAll();

        expect(Object.keys(allItems).length).toBe(1);
    });
});