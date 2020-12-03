const Express = require('express');
const BP = require('body-parser');
const app = Express();

const DB = require('./db');

app.use(BP.json());

app.get('/posts', (req, res, next) => {

    DB.all('SELECT * FROM POSTS', (err, rows) => {
        if (err) return next(err);

        res.json(rows);
    });
});

app.get('/posts/:id', (req, res, next) => {

    const postId = req.params.id;

    DB.all('SELECT * FROM POSTS WHERE ID = ?', [postId], (err, rows) => {
        if (err) return next(err);

        res.json(rows);
    });
});

app.post('/posts', (req, res, next) => {

    const body = req.body; // { title: string, content: string }
    const title = body.title;
    const content = body.content;
    if (typeof title !== 'string' || typeof content !== 'string') {
        return next(new Error('invalid request'));
    }
    DB.run('INSERT INTO POSTS (TITLE, CONTENT) VALUES (?, ?)',
        [title, content], (err) => {
            if (err) return next(err);
            res.end('ok\n');
        });
});

app.delete('/posts/:id', (req, res, next) => {

    DB.run('DELETE FROM POSTS WHERE ID = ?', [req.params.id], (err) => {
        if (err) return next(err);
        res.end('ok\n');
    });
});

app.listen(8080);
