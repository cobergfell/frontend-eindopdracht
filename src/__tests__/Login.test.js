import {BrowserRouter} from "react-router-dom";
import React from "react";
import {fireEvent, render, screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect";
import Login from "../pages/Login"
import AuthoritiesContextProvider from "../context/AuthoritiesContextProvider";


beforeEach(()=>{
    const {  } = render(

    <AuthoritiesContextProvider>
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    </AuthoritiesContextProvider>,
        )
    //onSubmit.mockClear()
})


test('Login button should trigger loading data ', async () => {
    //see https://stackoverflow.com/questions/66043164/testing-click-event-in-react-testing-library
    const button = screen.getByRole('button')

    fireEvent.click(button)
    expect(screen.getByText('loading')).toBeInTheDocument()

})

// the use of describe below is not necessary because there is only one test 'grouped' within this describe
// but I just keep it like this as reference for future work or if some extra tests are added as part of testing 'Login Form
describe("Check if some elements are present on the page", () => {
    // we just check some arbitrary elements, but it should be applied for all elements in a real app
    it("should render the basic fields", () => {
        expect(
            screen.getByText('Username')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Password')
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button",{ name: /Login/i })
        ).toBeInTheDocument();// slashes are for substring match, i for ignore case
        // see https://testing-library.com/docs/queries/about#textmatch
    });
});



it("should login when credentials ate submitted", () => {
    // based https://stackoverflow.com/questions/41223963/jest-how-to-mock-console-when-it-is-used-by-a-third-party-library
    jest.spyOn(global.console, 'warn').mockImplementation();

    //const logSpy = jest.spyOn(console, "log");



    fireEvent.input(screen.getByRole("textbox", { name: /username/i }), {
        target: {
            value:
                "cobergfell"
        }
    });

    fireEvent.input(screen.getByRole("textbox", { name: /password/i }), {
        target: {
            value:
                "cobergfell001"
        }
    });

    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    expect(console.warn).toBeCalledTimes(1)
    expect(console.warn).toBeCalledWith('my error');

});


//"test" and "it" are both used as synonym, as example of valid syntax

//see also  https://claritydev.net/blog/testing-react-hook-form-with-react-testing-library/

