import { fRandomInteger } from '../../Lib/HashFunc';

export class UserNameGenerator {
    protected aName: string[] = [
        'John',
        'Mary',
        'Hlow',
        'Jack',
        'Marty',
        'Mark',
        'Lusy',
        'Rabeka'
    ];

    protected aSurname: string[] = [
        'Dolsen',
        'Miller',
        'Mitcer',
        'Shepard',
        'Olsen'
    ];

    fGetNameLong(): string {
        let resp = '';

        resp += this.aName[fRandomInteger(0, this.aName.length)];
        resp += ' ';
        resp += this.aSurname[fRandomInteger(0, this.aSurname.length)];

        return resp;
    }

}