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