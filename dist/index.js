"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const FILE_PATH = "Data/data.json";
// Leer TAREAS desde el archivo JSON
function loadTasks() {
    if (!fs_1.default.existsSync(FILE_PATH))
        return []; // Si el archivo no existe, retorna un array vacío
    const data = fs_1.default.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data); // Retorna las tareas parseadas desde el archivo JSON
}
// Guardar tareas en el archivo JSON
function saveTasks(tasks) {
    fs_1.default.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}
//Lista donde se guardan las Tareas
let todos = loadTasks();
function mainMenu() {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "option",
                message: "¿Qué deseas hacer hoy?",
                choices: [
                    "📋 Ver tareas",
                    "➕ Agregar tarea",
                    "✅ Marcar tarea como completada",
                    "❌ Eliminar tarea",
                    "🚪 Salir",
                ],
            },
        ]);
        switch (answer.option) {
            case "📋 Ver tareas":
                viewTasks();
                break;
            case "➕ Agregar tarea":
                yield addTask();
                break;
            case "✅ Marcar tarea como completada":
                yield completeTask();
                break;
            case "❌ Eliminar tarea":
                yield deleteTask();
                break;
            case "🚪 Salir":
                console.log("👋 ¡Hasta luego!");
                return;
        }
        yield mainMenu();
    });
}
function viewTasks() {
    console.log("\nTareas");
    if (todos.length === 0) {
        console.log("No hay tareas por mostrar.");
    }
    else {
        todos.forEach((t, i) => console.log(`${i + 1}. [${t.done ? "✔" : " "}] ${t.task}`));
    }
}
function addTask() {
    return __awaiter(this, void 0, void 0, function* () {
        const answer = yield inquirer_1.default.prompt([
            {
                type: "input",
                name: "task",
                message: "Escribe la Nueva Tarea",
            },
        ]);
        todos.push({ task: answer.task, done: false });
        console.log("✅ Tarea agregada correctamente.");
        saveTasks(todos); // Guardar tareas en el archivo JSON
    });
}
function completeTask() {
    return __awaiter(this, void 0, void 0, function* () {
        if (todos.length === 0)
            return console.log("No hay tareas.");
        const answer = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "taskIndex",
                message: "Selecciona una tarea para marcar como completada:",
                choices: todos.map((t, i) => ({
                    name: `${i + 1}. ${t.task}`,
                    value: i,
                })),
            },
        ]);
        todos[answer.taskIndex].done = true;
        console.log("✅ Tarea marcada como completada.");
        saveTasks(todos);
    });
}
function deleteTask() {
    return __awaiter(this, void 0, void 0, function* () {
        if (todos.length === 0)
            return console.log("No hay tareas.");
        const answer = yield inquirer_1.default.prompt([
            {
                type: "list",
                name: "taskIndex",
                message: "Selecciona una tarea para eliminar:",
                choices: todos.map((t, i) => ({
                    name: `${i + 1}. ${t.task}`,
                    value: i,
                })),
            },
        ]);
        todos.splice(answer.taskIndex, 1);
        console.log("🗑️ Tarea eliminada correctamente.");
        saveTasks(todos);
    });
}
mainMenu();
