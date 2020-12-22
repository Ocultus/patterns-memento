interface Observable{
    observe():void
}
interface State{
    getState():Observable[]
}

class Person implements Observable{
    private readonly name:string
    private readonly age:number

    constructor(name:string,age:number){
        this.name=name
        this.age= age
    }

    observe(): void {
        console.log("i'm subscribe on a Person:",this.name)
    }

    getName():string{
        return this.name
    }

    getAge():number{
        return this.age
    }
    
}

class PersonState implements State{
   
    private state: Person[]

    constructor(){
        this.state = []
    }

    deletePersonById(id:number):void{
        if(id<0 || id > this.state.length){
              console.error("Invalid index");
        }
        this.state.splice(id,1)
    }

    addPerson(p:Person){
        this.state.push(p)
        return this
    }
    getState(): Observable[] {
        return this.state
    }
    save():PersonMemento{
        return new PersonMemento(this.state)
    }
    public restore(memento: PersonMemento): void {
        this.state = memento.getState();
        console.log(`PersonMemento: My state has changed to: ${JSON.stringify(this.state)}`);
    }
}

class PersonMemento{
    private readonly state: Person[]
    private readonly date:string
    constructor(state: Person[]){
        this.state = state
        this.date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    getState(): Person[] {
        return this.state 
    }
    getDate(): string {
        return this.date
    }
}

class Caretaker {
    private mementos: PersonMemento[] = [];

    private personState: PersonState;

    constructor(personState: PersonState) {
        this.personState = personState;
    }

    public backup(): void {
        console.log('\nCaretaker: Saving PersonState\'s state...');
        this.mementos.push(this.personState.save());
    }

    public undo(): void {
        if (!this.mementos.length) {
            return;
        }
        const memento = this.mementos.pop();

        console.log(`Caretaker: Restoring state to: ${memento.getDate()}`);
        this.personState.restore(memento);
    }

    public showHistory(): void {
        console.log('Caretaker: Here\'s the list of mementos:');
        for (const memento of this.mementos) {
            console.log(memento.getDate());
        }
    }
}

function main():void{
    const p1 = new Person('Dmitriy',20)
    const p2 = new Person("Ivan",20)
    const p3 = new Person("Vadim",20)

    const MPB_804 = new PersonState()
        .addPerson(p1)
        .addPerson(p2)
        .addPerson(p3)

    const caretaker = new Caretaker(MPB_804)

    caretaker.backup()
    MPB_804.deletePersonById(2)
    caretaker.backup()
    console.log('')
    caretaker.showHistory()
    caretaker.undo()
}
main()
