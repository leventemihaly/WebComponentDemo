class AppComponent extends HTMLElement {
    constructor() {
        super();
        this.onInputKeyDown = (e) => {
            if (e.keyCode === 13) {
                this.addNewItem();
            }
        };
        this.addNewItem = () => {
            if (this.input.value) {
                this.todoList.addItem({ name: this.input.value, isComplete: false });
                this.input.value = "";
            }
        };
    }
    connectedCallback() {
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
        this.todoList = this.root.querySelector("lm-todo-list");
        this.addButton = this.root.querySelector("button");
        this.todoList.addItem({ name: "homework", isComplete: false });
        this.todoList.addItem({ name: "webcomponent demo", isComplete: true });
        this.todoList.addItem({ name: "cooking", isComplete: false });
        this.input.addEventListener("keydown", this.onInputKeyDown);
        this.addButton.addEventListener("click", this.addNewItem);
    }
}
window.customElements.define("lm-app", AppComponent);
class TodoItemComponent extends HTMLElement {
    constructor(item, removeCallback, completedCallback) {
        super();
        this.removeCallback = removeCallback;
        this.completedCallback = completedCallback;
        this.onClick = () => {
            this.item.isComplete = !this.item.isComplete;
            this.updateRendering();
            if (this.completedCallback) {
                this.completedCallback(this.item);
            }
        };
        this.item = item;
    }
    connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
<style>
li {
    display: flex;
}
li:hover{
    cursor: pointer;
}
.completed {
    text-decoration: wavy line-through lime;
}
button {
    height: 18px;
    width: 16px;
    padding: 0;
    margin: 0 10px;
}
</style>
<li class="${this.item.isComplete ? "completed" : ""}"><span></span><button>x</button></li>`;
        this.root.querySelector("li span").innerText = this.item.name;
        this.root.querySelector("li span").addEventListener("click", this.onClick);
        this.root.querySelector("button").addEventListener("click", () => {
            if (this.removeCallback)
                this.removeCallback(this.item);
        });
        this.updateRendering();
    }
    updateRendering() {
        if (this.item.isComplete) {
            this.root.querySelector("li").classList.add("completed");
        }
        else {
            this.root.querySelector("li").classList.remove("completed");
        }
    }
    get Item() {
        return this.item;
    }
}
window.customElements.define("lm-todo-item", TodoItemComponent);
class TodoListComponent extends HTMLElement {
    constructor() {
        super();
        this.addItem = (item) => {
            this.items.push(item);
            this.updateRendering(false);
            this.itemsRoot.appendChild(this.createTodoItemComponent(item));
        };
        this.removeItem = (item) => {
            let index = this.items.indexOf(item);
            this.items = this.items.filter((currItem) => { return currItem !== item; });
            this.updateRendering(false);
            this.itemsRoot.removeChild(this.itemsRoot.children[index]);
        };
        this.onCompletedItem = (item) => {
            this.updateRendering(false);
        };
        this.createTodoItemComponent = (item) => {
            return new TodoItemComponent(item, this.removeItem, this.onCompletedItem);
        };
        this.items = [];
    }
    static get observedAttributes() {
        return ["todoItems"];
    }
    get todoItems() {
        return this.items;
    }
    connectedCallback() {
        this.root = this.attachShadow({ mode: "open" });
        this.root.innerHTML = `
<style>

</style>
<span id="info" ></span>
<ul>
</ul>`;
        this.itemsRoot = this.root.querySelector("ul");
        this.info = this.root.getElementById("info");
        this.updateRendering(true);
    }
    updateRendering(rerender) {
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
}
window.customElements.define("lm-todo-list", TodoListComponent);
//# sourceMappingURL=out.js.map