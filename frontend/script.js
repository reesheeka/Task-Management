document.addEventListener("DOMContentLoaded", function() {
  const taskList = document.getElementById("task-list");
  const createTaskForm = document.getElementById("create-task-form");
  const uploadForm = document.getElementById("upload-form");
  const viewTasksButton = document.getElementById("view-tasks-button");

  function fetchTasks() {
    fetch("http://localhost:3000/get")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
          
            if (Array.isArray(data)) {
                displayTasks(data);
            } else {
                console.error("Fetched data is not an array:", data);
                throw new Error("Fetched data is not an array");
            }
        })
        .catch(error => console.error("Error fetching tasks:", error));
}

  function displayTasks(tasks) {
      taskList.innerHTML = "";
      tasks.forEach(task => {
          const { _id, Title, Description, Status } = task;
          const taskElement = document.createElement("div");
          taskElement.className = "task";
          taskElement.innerHTML = `
              <div>
                  <div class="task-title">${Title}</div>
                  <div class="task-desc">${Description}</div>
                  <div class="task-status">Status: ${Status}</div>
              </div>
              <div class="task-actions">
                  <button onclick="updateTask('${_id}')">Update</button>
                  <button onclick="deleteTask('${_id}')">Delete</button>
              </div>
          `;
          taskList.appendChild(taskElement);
      });
  }

  createTaskForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const Title = document.getElementById("task-title").value;
      const Description = document.getElementById("task-description").value;
      const Status = document.getElementById("task-status").value;

      const task = {
          Title,
          Description,
          Status
      };

      fetch("http://localhost:3000/add", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(task)
      })
      .then(response => {
          if (!response.ok) {
              return response.text().then(text => { throw new Error(text) });
          }
          return response.json();
      })
      .then(data => {
          createTaskForm.reset();
          window.alert("Task added successfully!");
      })
      .catch(error => {
          console.error("Error creating task:", error);
          window.alert("Failed to add task");
      });
  });

  uploadForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const formData = new FormData(uploadForm);

      fetch("http://localhost:3000/upload/:taskId", {
          method: "POST",
          body: formData
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network error' + response.statusText);
          }
          return response.json();
      })
      .then(data => {
          window.alert("File uploaded successfully!");
          uploadForm.reset();
      })
      .catch(error => {
          console.error("Error uploading file:", error);
          window.alert("Failed to upload file");
      });
  });

  viewTasksButton.addEventListener("click", function() {
      fetchTasks();
  });

  window.updateTask = function(taskId) {
      const newTitle = prompt("Enter new title:");
      const newDescription = prompt("Enter new description:");
      const newStatus = prompt("Enter new status (pending/completed):");

      if (newTitle && newDescription && newStatus) {
          fetch(`http://localhost:3000/update/${taskId}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  Title: newTitle,
                  Description: newDescription,
                  Status: newStatus
              })
          })
          .then(response => {
              if (!response.ok) {
                  return response.text().then(text => { throw new Error(text) });
              }
              return response.json();
          })
          .then(data => {
              fetchTasks();
              window.alert("Task updated successfully!");
          })
          .catch(error => {
              console.error("Error updating task:", error);
              window.alert("Failed to update task: " + error.message);
          });
      }
  };

  window.deleteTask = function(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        fetch(`http://localhost:3000/delete/${taskId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.error || "Error deleting task") });
            }
            fetchTasks();
            window.alert("Task deleted successfully!");
        })
        .catch(error => {
            console.error("Error deleting task:", error);
            window.alert("Failed to delete task");
        });
    }
};


  fetchTasks();
});
