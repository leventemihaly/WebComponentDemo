class AppComponent extends HTMLElement {

    private root: ShadowRoot;
    private todoList: TodoListComponent;
    private input: HTMLInputElement;
    private addButton: HTMLButtonElement;

    constructor() {
        super();
    }

    connectedCallback(): void {
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
<style>

</style>
<div style="display: flex">
    <input type="text" /> <button>add</button>
</div>
<lm-todo-list></lm-todo-list>
`;
        this.input = this.root.querySelector("input");
        this.todoList = <TodoListComponent>this.root.querySelector("lm-todo-list");
        this.addButton = this.root.querySelector("button");

        this.todoList.addItem({ name: "homework", isComplete: false });
        this.todoList.addItem({ name: "webcomponent demo", isComplete: true });
        this.todoList.addItem({ name: "cooking", isComplete: false });

        this.input.addEventListener("keydown", this.onInputKeyDown);
        this.addButton.addEventListener("click", this.addNewItem);
    }

    private onInputKeyDown = (e: KeyboardEvent) => {
        if (e.keyCode === 13) {
            this.addNewItem();
        }
    }

    private addNewItem = () => {
        if (this.input.value) {
            this.todoList.addItem({ name: this.input.value, isComplete: false });
            this.input.value = "";
        }
    }
}

window.customElements.define("lm-app", AppComponent);

