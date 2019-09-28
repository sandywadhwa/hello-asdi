const express = require('express')
const app = express()
const shortid = require('shortid')
var bodyParser = require('body-parser')
const port = 3000


app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.sendFile(__dirname+'/public/views/index.html'))
app.get('/generic', (req, res) => res.sendFile(__dirname+'/public/views/generic.html'))
app.get('/elements', (req, res) => res.sendFile(__dirname+'/public/views/elements.html'))


var courses = [];

// curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/courses
app.get('/api/courses', function(req, res){
    res.json(courses);
});

// curl -X POST -H "Content-Type: application/json" -d '{"title": "ASDI"}' http://localhost:3000/api/courses
app.post('/api/courses', function(req, res){
    genid = shortid.generate();
    console.log(JSON.stringify(req.body));
    req.body['id'] = genid;
    courses.push(req.body);
    res.json(req.body);
});

function findCourseWithId(courseId){
    var course = {};
    for (var index = 0; index < courses.length; ++index) {
        entry = courses[index];
        if (entry.id === courseId ) {
            course = entry;
            break;
        }
    }
    return course;
}
function deleteCourseWithId(courseId){
    var course = {};
    for (var index = 0; index < courses.length; ++index) {
        entry = courses[index];
        if (entry.id === courseId ) {
            courses.remove(index);
            break;
        }
    }
    return course;
}
function replaceCourseWithId(courseId, newCourse){
    for (var index = 0; index < courses.length; ++index) {
        entry = courses[index];
        if (entry.id === courseId ) {
            courses.remove(index);
            newCourse['id'] = courseId; 
            courses.push(newCourse);
            break;
        }
    }
}

function updateCourseWithId(courseId, updatedCourse){
    for (var index = 0; index < courses.length; ++index) {
        entry = courses[index];
        if (entry.id === courseId ) {
            Object.entries(updatedCourse).forEach(item => {
                const key = item[0];
                const val = item[1];
                courses[index][key] = val;
            });
            break;
        }
    }
}

// curl -X GET -H "Content-Type: application/json" http://localhost:3000/api/courses/<id>
app.get('/api/courses/:courseId', function(req, res){
    var courseId = req.params.courseId;
    res.json(findCourseWithId(courseId));
});

// curl -X DELETE -H "Content-Type: application/json" http://localhost:3000/api/courses/<id>
app.delete('/api/courses/:courseId', function(req, res){
    var courseId = req.params.courseId;
    deleteCourseWithId(courseId)
    res.json({'message' : 'success'});
});

//curl -X PATCH -H "Content-Type: application/json" -d '{"title": "CPSNEW"}' http://localhost:3000/api/courses/<id>
app.patch('/api/courses/:courseId', function(req, res){
    var courseId = req.params.courseId;
    updateCourseWithId(courseId, req.body);
    res.json(findCourseWithId(courseId));
});

//curl -X PUT -H "Content-Type: application/json" -d '{"title": "CPS", "author": "Being Zero"}' http://localhost:3000/api/courses/<id>
app.put('/api/courses/:courseId', function(req, res){
    var courseId = req.params.courseId;
    replaceCourseWithId(courseId, req.body);
    res.json(findCourseWithId(courseId));
});

app.get('/welcome', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
