async function process_argv() {
    let { argv } = process;
    argv = argv.slice(2);
    const result = await studentActivitiesRegistration(argv);

    return result;
}

async function getStudentActivities() {
    return fetch('http://localhost:3001/activities')
    .then(response => response.json())
    
}

async function studentActivitiesRegistration(data) {
    const method = data[0]
    let result = {};

    if (method === "CREATE") {
        const name = data[1]
        const day = data[2]
        const activities = await getStudentActivities(day);
        let getActivities = activities.filter((activity) => activity.days == day)
        const studentData = {
            id: 2,
            name,
            activities: getActivities,
        };
         result = await addStudent(studentData);
    } else if (method === "DELETE") {
        const Id = data[1]
        result = await deleteStudent(Id);
        result.message = `Successfully deleted student data with id ${Id}`;
    }

    return result;
     // TODO: replace this
}

async function addStudent(name, day) {
    const studentActivities = await getStudentActivities();

  const availableActivities = studentActivities.filter(activity => {
    return activity.days.includes(day);
  });

  const activities = availableActivities.map(activity => {
    return {
      name: activity.name,
      desc: activity.desc
    };
  });
  const data = {
      id: 2,
      name: name,
      activities: activities,
    }

  const response = await fetch('http://localhost:3001/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const newStudent = await response.json();

  return newStudent
}

async function deleteStudent(id) {
    const getId = id
    const response = await fetch(`http://localhost:3001/students/${getId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
    const result = await response.json();
    return result;
}

process_argv()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = {
    studentActivitiesRegistration,
    getStudentActivities,
    addStudent,
    deleteStudent
};
