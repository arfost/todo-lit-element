import { LitElement, html } from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';

export class TaskElement extends LitElement {
    static get is() { return 'task-element' }
    static get properties() {
        return {
            name: String,
            done: Boolean,
            id: String
        }
    }
    constructor() {
        super();
        this.addEventListener('click', async (e) => {
            firebase.app().database().ref('/tasks/' + this.id + '/done').set(!this.done)
        });
    }

    //will render the element
    _render({ name, done, id }) {
        return html`<style> .done { color: green; } .not-done { color:red; }</style>
        <li><div class$="${done ? 'done' : 'not-done'}" style="display:flex;align-items: end;justify-content: space-between;"><span on-dblclick=${(e) => this.supprTask(e)}>${name}</span> <span style="width:25%"><img src$="/src/img/${done ? 'checked-box' : 'unchecked-box'}.svg"></img></span></div></li>`;
    }
    supprTask(e) {
        console.log("suppre suppre")
        firebase.app().database().ref('/tasks/' + this.id + '/suppr').set(true)
    }
}

export class TaskList extends LitElement {
    static get is() { return 'task-list' }
    //we need to init values in constructor
    constructor() {
        super();
        firebase.app().database().ref('/tasks/').on('value', (snapshot) => {
            let tasks = snapshot.val();
            this.tasks = tasks;
        });
    }
    static get properties() {
        return {
            tasks: Array
        }
    }
    _render({ tasks }) {

        if (tasks)
            return html`<style>#newtodo {margin:1em} #post { display: block; text-align: center; background: #039be5; text-transform: uppercase; text-decoration: none; color: white; padding: 16px; border-radius: 4px; }</style>
        <ul>${tasks.map((task, index) => this.renderListTask(task, index))}</ul>
        <input type="text" id="newtodo"><button id="post" on-click=${(e) => this.onAddNewTask(e)}>add</button>`;
        else
            return html`<div style="margin:1em">loading...</div>`
    }

    renderListTask(task, index) {
        if (!task.suppr) {
            return html`<task-element id="${index}" name="${task.name}" done=${task.done}></task-element>`
        } else {
            return html``
        }
    }

    onAddNewTask(e) {
        console.log("clouck clouck : ", e);
        let name = this.shadowRoot.getElementById("newtodo").value;
        if (name) {
            this.shadowRoot.getElementById("newtodo").value = ""
            firebase.app().database().ref('/tasks/' + this.tasks.length).set({
                done: false,
                name: name
            })
        }
    }
}

export class SharedBalls extends LitElement {
    static get is() { return 'shared-balls' }
    //we need to init values in constructor
    constructor() {
        super();
        firebase.app().database().ref('/balls/').on('value', (snapshot) => {
            this.ballPos = snapshot.val();
        });
    }
    static get properties() {
        return {
            ballPos: Number
        }
    }
    _render({ ballPos }) {

        if (ballPos !== undefined)
            return html`<style>.butt{display:contents} #ballPist {display: inline-block;width:90%} #ball{position:relative; height:1em}</style>
        <div style="margin-top:2em">
            <button class="butt" on-click=${(e) => this.back(e)}><</button>
            <span id="ballPist"><img id="ball" style$="left:${this.ballPos}px" src="/src/img/car-01.svg"></img></span>
            <button class="butt" on-click=${(e) => this.go(e)}>></button>
        <div>`;
        else
            return html`<div style="margin:1em">loading...</div>`
    }

    go(e) {
        console.log("go")
        firebase.app().database().ref('/balls/').transaction(value => {
            if (value !== null) {
                value = value + 5;
                return value;
            } else {
                return 0;
            }
        })
    }

    back(e) {
        console.log("back")
        firebase.app().database().ref('/balls/').transaction(value => {
            if (value !== null) {
                value = value - 5;
                return value;
            } else {
                return 0;
            }
        })
    }
}