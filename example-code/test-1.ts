type B = {
    name: string;
    age?: number;
}

type A = {
    name: string;
    lastName: string;
}

const c: A = { name: "test", lastName: "test" };
const d: B = c;

let testName = 'Mateusz';

typeof testName; // string

testName = 42; // Error: Type 'number' is not assignable to type 'string'