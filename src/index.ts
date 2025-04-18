import inquirer from "inquirer";
import  fs from "fs";
const  FILE_PATH = "Data/data.json"; 

// Leer TAREAS desde el archivo JSON
function loadTasks(): { task: string; done: boolean }[] {
    if (!fs.existsSync(FILE_PATH)) return []; // Si el archivo no existe, retorna un array vacío

    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data); // Retorna las tareas parseadas desde el archivo JSON
}

// Guardar tareas en el archivo JSON
function saveTasks(tasks: { task: string; done: boolean }[]) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), "utf-8");
}



//Lista donde se guardan las Tareas
let todos = loadTasks();

async function mainMenu(){
    const answer  = await inquirer.prompt([
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
            await addTask();
            break;
        
        case "✅ Marcar tarea como completada":
            await completeTask();
            break;
        
        case "❌ Eliminar tarea":
            await deleteTask();
            break;
        
        case "🚪 Salir":
            console.log("👋 ¡Hasta luego!");
            return;
    }

    await mainMenu();

}

function viewTasks(){
    console.log("\nTareas");
    if (todos.length === 0){
        console.log("No hay tareas por mostrar.");

    } else {
        todos.forEach((t,i) =>
            console.log(`${i + 1}. [${t.done ? "✔" : " "}] ${t.task}`)
     );
    }
}

async function addTask(){
    const answer = await  inquirer.prompt([
        {
            type: "input",
            name: "task",
            message:"Escribe la Nueva Tarea",
        },
    ]);
    todos.push({task: answer.task, done: false});
    console.log("✅ Tarea agregada correctamente.");
    saveTasks(todos); // Guardar tareas en el archivo JSON
}

async function completeTask() {
    if (todos.length === 0) return console.log("No hay tareas.");
  
    const answer = await inquirer.prompt([
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

    todos[answer.taskIndex].done = true
    console.log("✅ Tarea marcada como completada.");
    saveTasks(todos);

}

async function deleteTask() {
    if (todos.length === 0) return console.log("No hay tareas.");

    const answer = await inquirer.prompt([
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

}

mainMenu();