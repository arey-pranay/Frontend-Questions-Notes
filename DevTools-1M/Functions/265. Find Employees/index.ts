type Employee = {
    id: number;
    name: string;
    children?: Employee[];
};

function findEmployee(employees: Employee | null, id: number): Employee | null {
    // write your solution
    if (!employees) return null;
    if (employees.id == id) {
        return employees;
    }

    if (employees.children) {
        for (const emp of employees.children) {
            const temp = findEmployee(emp, id);
            if (temp) return temp;
        }
    }

    return null;
}
