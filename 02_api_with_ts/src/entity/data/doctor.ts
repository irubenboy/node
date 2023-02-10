export class Doctor {

    constructor(public id: number, public dni: string, public name: string, public specialty = "", public year: number, public college: number, public job: string) { }

    toCSV(): string {
        return `${this.id},${this.dni}, ${this.name}, ${this.specialty}, ${this.year}, ${this.year}, ${this.college}, ${this.job}`
    }

    static fromJSON(json: {
        id: number;
        dni: string;
        name: string;
        specialty: string;
        year: number;
        collegiateNumber: number;
        job: string;
    } | undefined): Doctor {
        return json ? new Doctor(json.id, json.dni, json.name, json.specialty, json.year, json.collegiateNumber, json.job) : this.emptyDoctor()
    }

    private static emptyDoctor() {

        return new Doctor(0, "", "", "", 0, 0, "")
    }
}