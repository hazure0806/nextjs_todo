import {
  VStack,
  Heading,
  Input,
  Button,
  Checkbox,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import axios from "axios";

type Task = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  deleted_at: string | null;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get("/api/tasks");
      setTasks(response.data.tasks);
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (newTask === "") return;

    const response = await axios.post("/api/tasks", { title: newTask });
    setTasks([...tasks, response.data.task]);
    setNewTask("");
  };

  async function toggleComplete(task: Task) {
    const updatedTask = { ...task, completed: !task.completed };

    await axios.put(`/api/tasks/${task.id}`, updatedTask);

    setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
  }

  async function deleteTask(id: number) {
    await axios.delete(`/api/tasks/${id}`);

    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <VStack spacing={4} align="center">
      <Heading>Todo App</Heading>

      <Box>
        <Flex>
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task"
            w="40vw"
            mr={5}
          />
          <Button onClick={addTask}>Add task</Button>
        </Flex>
      </Box>

      {tasks.map((task) => (
        <Flex key={task.id}>
          <Box width="200px">
            <Checkbox
              defaultChecked={task.deleted_at === null}
              onChange={() => toggleComplete(task)}
              mr={5}
            >
              <Text fontSize={20}>{task.title}</Text>
            </Checkbox>
          </Box>
          <Button onClick={() => deleteTask(task.id)} w="60px" h="30px">
            Delete
          </Button>
        </Flex>
      ))}
    </VStack>
  );
}
