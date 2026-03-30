const fs = require('fs');

async function test() {
    try {
        const adminjs = await import('adminjs');
        const express = await import('@adminjs/express');
        const mongoose = await import('@adminjs/mongoose');

        console.log('adminjs:', Object.keys(adminjs));
        console.log('express:', Object.keys(express));
        console.log('mongoose:', Object.keys(mongoose));

        if (express.buildAuthenticatedRouter) {
            console.log('buildAuthenticatedRouter found on express');
        } else if (express.default && express.default.buildAuthenticatedRouter) {
            console.log('buildAuthenticatedRouter found on express.default');
        } else {
            console.log('buildAuthenticatedRouter NOT found');
        }
    } catch (err) {
        console.error('Error during import:', err);
    }
}

test();
