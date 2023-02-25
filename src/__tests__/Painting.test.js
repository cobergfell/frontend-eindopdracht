import axios from 'axios';
jest.mock("axios");
import React from "react";
import enzyme, { shallow,mount } from "enzyme";
import {BrowserRouter} from "react-router-dom";
import {cleanup, fireEvent, getByTestId, render, screen} from "@testing-library/react"
import user from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import Painting from "../pages/Painting/Painting"
import AuthoritiesContextProvider from "../context/AuthoritiesContextProvider";
//import AuthService from "../services/auth.service";
//import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import expect from "expect";
enzyme.configure({ adapter: new Adapter() });



const paintingObj =

    {
        "paintingId": 1,
        "username": "cobergfell",
        "title": "test",
        "artist": "test",
        "description": "test",
        "image": "iVBO",
        "dateTimePosted": "2022-10-25 13:03:27",
        "lastUpdate": "2022-10-25 13:03:27",
        "attachedFiles": [],
        "attachedMusicFiles": []
    }

const jsonPaintingObj =JSON.stringify(paintingObj)

/*global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(jsonPaintingObj)
}));*/


jest.mock("axios");
axios.get.mockImplementation(() => Promise.resolve({ data: jsonPaintingObj }));



jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({
        state: {paintingId:"1"}
    })
}));


/*jest.mock("useState", () => ({
    ...jest.requireActual("useState"),
    useState: () => ({
        painting: jsonPaintingObj
    })
}));*/


const url="`http://localhost:8080/api/user/paintings/1`"


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


        // global.fetch = jest.fn(() => Promise.resolve({
        //     json: () => Promise.resolve(jsonPaintingObj)
        // }));
        axios.get.mockImplementationOnce(() =>
            Promise.resolve({
                data: { results: jsonPaintingObj }
            })
        );


        const mockId = "user";
        //const mockJson = { data: "json data" };
        const data={
            accesToken:"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjb2JlcmdmZWxsIiwiZXhwIjoxNjY3MzkzOTQ4LCJpYXQiOjE2NjY1Mjk5NDh9.6CM3qsUxgfFk8Y_QOGhbfdcFLxAnXWO1x6fIs3yr3ic",
            email: "Christophe.Obergfell@novi-education.nl",
            roles: ["ROLE_USER","ROLE_MODERATOR", "ROLE_ADMIN"],
            tokenTYpe: "Bearer",
            username: "cobergfell"
        };
        const jsonData =JSON.stringify(data)

        const mockJson = { data: jsonData };
        setLocalStorage(mockId, mockJson);

        const {  } = render(

            <AuthoritiesContextProvider>
                <BrowserRouter>
                    <Painting />
                </BrowserRouter>
            </AuthoritiesContextProvider>,
        )


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

    test("two ID's is in localStorage", () => {
        const mockId = "333";
        const mockOldData = { data: "json data" };
        const mockNewData = { data: " new data" };

        window.localStorage.setItem(mockId, JSON.stringify(mockOldData));
        setLocalStorage(mockId, mockNewData);

        const allItems = window.localStorage.getAll();

        expect(Object.keys(allItems).length).toBe(2);
    });


    describe("Check if some elements are in the document", () => {
        // we just check some arbitrary elements, but it should be applied for all elements in a real app
        it("should render No painting available when painting is null", () => {
            expect(
                screen.getByText('No painting available')
            ).toBeInTheDocument();

            // expect(
            //     screen.getByText('Painting data')
            // ).toBeInTheDocument();
            // expect(
            //     screen.getByText('Supplemental files')
            // ).toBeInTheDocument();
            // expect(
            //     screen.getByText('Audio files')
            // ).toBeInTheDocument();
            //
            // expect(
            //     screen.getByText('Blog')
            // ).toBeInTheDocument();
            // expect(
            //     screen.getByRole("button",{ name: /Send question/i })
            // ).toBeInTheDocument();// slashes are for substring match, i for ignore case
            // see https://testing-library.com/docs/queries/about#textmatch
        });

        it("should render when painting is available", () => {
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(url)
            // expect(
            //     screen.getByText('Painting data')
            // ).toBeInTheDocument();

        });



/*            describe('Testing Painting bla bla', () => {
                it('bla bla', () => {
                    // const renderedComponent = shallow(<Painting/>);
                    // renderedComponent.setState({ painting: paintingObj });
                    // expect(renderedComponent.state().painting).to.equal(paintingObj);
                    const wrapper = mount(<Painting/>)
                    //expect(wrapper.find('.title-blog-box')).to.have.lengthOf(1);
                    expect(wrapper.find('.no-paintings')).to.have.lengthOf(1);

                    //expect(p.text()).toBe('Blog');
                    // expect(
                    //     screen.getByText('Painting data')
                    // ).toBeInTheDocument();

                });
            });*/





       /* describe('simple test', () => {
            it('clicks it', () => {
                const app = shallow(<Painting />)
                const instance = app.instance()
                const spy = jest.spyOn(instance, 'fetchPainting')
                instance.forceUpdate();

                // const p = app.find('.button')
                // p.simulate('click')
                expect(spy).toHaveBeenCalled()
            })
        })


        describe('componentA', () => {
            it('should call componentB', () => {
                const wrapper = enzyme.shallow(<Painting/>)

                const spy = jest.spyOn(wrapper.instance(), 'fetchPainting');
                wrapper.instance().forceUpdate();
                wrapper.instance().fetchPainting()
                expect(spy).toHaveBeenCalled()
            })
        })
*/




    });

});


/*
it("fetches painting data", async () => {
    // setup
    mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
            data: { results: jsonPaintingObj }
        })
    );

    // work
    const images = await unsplash("cats");

    // expect
    expect(images).toEqual(["cat.jpg"]);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
        "https://api.unsplash.com/search/photos",
        {
            params: {
                client_id: process.env.REACT_APP_UNSPLASH_TOKEN,
                query: "cats"
            }
        }
    );
});*/
