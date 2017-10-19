class TodoItemComponent extends HTMLElement {
    private item: ITodoItem;
    private root: ShadowRoot;    

    constructor(item: ITodoItem,
        private removeCallback?: (ITodoItem) => void,
        private completedCallback?: (ITodoItem) => void) {

        super();

        this.item = item;        
    }

    connectedCallback(): void {
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

        (<HTMLSpanElement>this.root.querySelector("li span")).innerText = this.item.name;
        this.root.querySelector("li span").addEventListener("click", this.onClick);

        this.root.querySelector("button").addEventListener("click", () => {
            if (this.removeCallback) this.removeCallback(this.item);
        });

        this.updateRendering();
    }

    private onClick = () => {
        this.item.isComplete = !this.item.isComplete;

        this.updateRendering();

        if (this.completedCallback) {
            this.completedCallback(this.item);
        }
    }

    private updateRendering(): void {
        if (this.item.isComplete) {
            this.root.querySelector("li").classList.add("completed");
        } else {
            this.root.querySelector("li").classList.remove("completed");
        }
        
    }    

    public get Item() {
        return this.item;
    }
}

window.customElements.define("lm-todo-item", TodoItemComponent);