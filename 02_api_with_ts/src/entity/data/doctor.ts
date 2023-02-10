export class Doctor {

    constructor(public id: number, public dni: string, public name: string, public specialty = "", public year: number, public college: number, public job: string) { }

    toCSV(): string {
        return `${this.id},${this.dni}, ${this.name}, ${this.specialty}, ${this.year}, ${this.year}, ${this.college}, ${this.job}`
    }
}