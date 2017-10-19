class TodoListComponent extends HTMLElement {

    private root: ShadowRoot;
    private items: Array<ITodoItem>;
    private itemsRoot: HTMLElement;
    private info: HTMLElement;

    constructor() {
        super();

        this.items = [];
    }

    static get observedAttributes() {
        return ["todoItems"];
    }

    public get todoItems() {
        return this.items;
    }

    connectedCallback(): void {
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
<style>

</style>
<span id="info" ></span>
<ul>
</ul>`

        this.itemsRoot = this.root.querySelector("ul");
        this.info = this.root.getElementById("info");
        this.updateRendering(true);
    }

    private updateRendering(rerender: boolean): void {
        this.info.innerText = `You have ${this.items.filter((t) => !t.isComplete).length}/${this.items.length} items`;

        if (rerender) {
            let range = document.createRange();
            range.selectNodeContents(this.itemsRoot);
            range.deleteContents();

            this.items.forEach((currItem) => {                
                this.itemsRoot.appendChild(this.createTodoItemComponent(currItem));
            });
        }
    }

    public addItem = (item: ITodoItem) => {
        this.items.push(item);
        this.updateRendering(false);
        this.itemsRoot.appendChild(this.createTodoItemComponent(item));
    }

    public removeItem = (item: ITodoItem) => {
        let index = this.items.indexOf(item);
        this.items = this.items.filter((currItem) => { return currItem !== item });
        this.updateRendering(false);
        this.itemsRoot.removeChild(this.itemsRoot.children[index]);
    }

    private onCompletedItem = (item: ITodoItem) => {
        this.updateRendering(false);
    }

    private createTodoItemComponent = (item: ITodoItem) => {
        return new TodoItemComponent(item, this.removeItem, this.onCompletedItem);
    }
}

window.customElements.define("lm-todo-list", TodoListComponent)