const jsonServer = require('json-server');
const express = require('express');
const server = jsonServer.create();
const router1 = jsonServer.router('db.json');
const router2 = jsonServer.router('bulk.json');
const middlewares = jsonServer.defaults();
const _ = require('lodash');

// Middleware untuk menambahkan ID yang diincrement saat membuat data baru
server.use(jsonServer.bodyParser);
// Middleware untuk menambahkan ID yang diincrement saat membuat data baru
server.use((req, res, next) => {
    if (req.method === 'POST') {
        const data = router1.db.get('data').value(); // Ambil data dari basis data
        const lastItem = _.maxBy(data, 'id');
        const newId = lastItem ? lastItem.id + 1 : 1;
        req.body.id = newId;
    }
    next();
});





// Gunakan middlewares default
server.use(middlewares);

// Middleware untuk menangani kesalahan
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status_code: 500, message: 'Terjadi kesalahan dalam server.' });
});

// Rute untuk mendapatkan semua data dari Database
server.get('/basic/data', (req, res) => {
    const data = router1.db.get('data').value();
    res.json({ status_code: 200, message: 'Berhasil mendapatkan data dari Database', data });
});

// Rute untuk mendapatkan data berdasarkan ID dari Database
server.get('/basic/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = router1.db.get('data').find({ id: id }).value();

    if (data) {
        res.json({ status_code: 200, message: 'Berhasil mendapatkan data dari Database', data });
    } else {
        res.status(404).json({ status_code: 404, message: 'ID tidak ditemukan di Database' });
    }
});

// Rute untuk menambah data ke Database
server.post('/basic/data', (req, res) => {
    // Mendapatkan data dari permintaan POST
    const data = req.body;

    // Menyimpan data ke basis data Database
    router1.db.get('data').push(data).write();

    res.json({ status_code: 201, message: 'Data berhasil ditambahkan ke Database', data });
});

// Rute untuk mengupdate data di Database berdasarkan ID
server.put('/basic/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const existingData = router1.db.get('data').find({ id: id }).value();

    if (existingData) {
        // Mengupdate data dengan ID yang sesuai
        router1.db.get('data').find({ id: id }).assign(updatedData).write();
        res.json({ status_code: 200, message: 'Data berhasil diupdate di Database', data: updatedData });
    } else {
        res.status(404).json({ status_code: 404, message: 'ID tidak ditemukan di Database' });
    }
});

// Rute untuk menghapus data di Database berdasarkan ID
server.delete('/basic/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const existingData = router1.db.get('data').find({ id: id }).value();

    if (existingData) {
        // Menghapus data dengan ID yang sesuai
        router1.db.get('data').remove({ id: id }).write();
        res.json({ status_code: 200, message: 'Data berhasil dihapus dari Database' });
    } else {
        res.status(404).json({ status_code: 404, message: 'ID tidak ditemukan di Database' });
    }
});

// Rute untuk mendapatkan semua data dari Bulk Database
server.get('/bulk/data', (req, res) => {
    const data = router2.db.get('data').value();
    res.json({ status_code: 200, message: 'Berhasil mendapatkan data dari Bulk Database', data });
});

// Rute untuk mendapatkan data berdasarkan ID dari Bulk Database
server.get('/bulk/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const data = router2.db.get('data').find({ id: id }).value();

    if (data) {
        res.json({ status_code: 200, message: 'Berhasil mendapatkan data dari Bulk Database', data });
    } else {
        res.status(404).json({ status_code: 404, message: 'ID tidak ditemukan di Bulk Database' });
    }
});

// Rute untuk menambah data ke Bulk Database
server.post('/bulk/data', (req, res) => {
    // Mendapatkan data dari permintaan POST
    const data = req.body;

    // Menyimpan data ke basis data Bulk Database
    router2.db.get('data').push(data).write();

    res.json({ status_code: 201, message: 'Data berhasil ditambahkan ke Bulk Database', data });
});

// Rute untuk mengupdate data di Bulk Database berdasarkan ID
server.put('/bulk/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const existingData = router2.db.get('data').find({ id: id }).value();

    if (existingData) {
        // Mengupdate data dengan ID yang sesuai
        router2.db.get('data').find({ id: id }).assign(updatedData).write();
        res.json({ status_code: 200, message: 'Data berhasil diupdate di Bulk Database', data: updatedData });
    } else {
        res.status(404).json({ status_code: 404, message: 'ID tidak ditemukan di Bulk Database' });
    }
});

// Rute untuk menghapus data di Bulk Database berdasarkan ID
server.delete('/bulk/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const existingData = router2.db.get('data').find({ id: id }).value();

    if (existingData) {
        // Menghapus data dengan ID yang sesuai
        router2.db.get('data').remove({ id: id }).write();
        res.json({ status_code: 200, message: 'Data berhasil dihapus dari Bulk Database' });
    } else {
        res.status(404).json({ status_code: 404, message: 'ID tidak ditemukan di Bulk Database' });
    }
});

// Port untuk server JSON tunggal
const port = 3000;

server.listen(port, () => {
    console.log(`JSON Server berjalan pada port ${port}`);
});
