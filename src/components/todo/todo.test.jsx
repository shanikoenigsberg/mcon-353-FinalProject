import { render, screen } from '@testing-library/react';
import {Todo} from './todo';
import {TodoProvider} from "../state/context";
import userEvent from '@testing-library/user-event';


describe('Todo component', () => {
    test("When a task title is typed into the input box and the 'add' button is clicked, a new todo item is added to the list", () => {
        render(<TodoProvider><Todo /></TodoProvider>);

        const inputEl = screen.getByPlaceholderText("add task");
        userEvent.type(inputEl, "mow lawn");

        const buttonEl = screen.getByText("+")
        userEvent.click();

        const taskEl = screen.getByTestId("todoItem_text");
        expect(taskEl.textContent).toEqual("mow lawn");


    });

    test("view todos", () => {
        render(<Todo></Todo>);
    })

    //test doesnt do anything
    test("All added todo items are shown in a list", () => {
        render(<TodoProvider><Todo /></TodoProvider>);
        const inputEl = screen.getByPlaceholderText("add task");
        console.log(inputEl);
    });
});