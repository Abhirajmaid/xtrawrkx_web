#!/usr/bin/env node

/**
 * Team Data Migration Script
 * 
 * This script migrates the existing static team data to Firebase Firestore.
 * Run this once to populate the team collection in Firestore.
 * 
 * Usage:
 * node src/scripts/migrateTeamData.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { team } from '../data/teamData.js';

// Firebase configuration (use the same as in your app)
const firebaseConfig = {
    apiKey: "AIzaSyCRyooUo6KheeDUEuEV9Add_XozmN_p--0",
    authDomain: "xtrawrkx.firebaseapp.com",
    projectId: "xtrawrkx",
    storageBucket: "xtrawrkx.firebasestorage.app",
    messagingSenderId: "647527626177",
    appId: "1:647527626177:web:7a791b0e6a5d8c14f9ab40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateTeamData() {
    console.log('🚀 Starting team data migration...');
    console.log(`📊 Found ${team.length} team members to migrate`);

    try {
        // Check if data already exists
        const existingData = await getDocs(collection(db, 'team'));
        if (!existingData.empty) {
            console.log('⚠️  Team collection already has data.');
            console.log(`   Found ${existingData.size} existing members.`);

            const answer = await promptUser('Do you want to continue and add more members? (y/N): ');
            if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
                console.log('❌ Migration cancelled.');
                return;
            }
        }

        let migrated = 0;
        let skipped = 0;

        for (const member of team) {
            try {
                // Check if member already exists (by name and email)
                const existingQuery = query(
                    collection(db, 'team'),
                    where('name', '==', member.name),
                    where('email', '==', member.email)
                );
                const existingMembers = await getDocs(existingQuery);

                if (!existingMembers.empty) {
                    console.log(`⏭️  Skipping ${member.name} (already exists)`);
                    skipped++;
                    continue;
                }

                // Prepare member data for Firestore
                const memberData = {
                    name: member.name,
                    title: member.title,
                    location: member.location,
                    img: member.img,
                    linkedin: member.linkedin,
                    email: member.email,
                    bio: member.bio || `${member.title} at xtrawrkx with expertise in automotive and manufacturing.`,
                    category: member.category,
                    isActive: member.isActive ?? true,
                    joinDate: member.joinDate || new Date().toISOString().split('T')[0],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                // Add to Firestore
                const docRef = await addDoc(collection(db, 'team'), memberData);
                console.log(`✅ Migrated ${member.name} (ID: ${docRef.id})`);
                migrated++;

            } catch (memberError) {
                console.error(`❌ Error migrating ${member.name}:`, memberError.message);
            }
        }

        console.log('\n🎉 Migration completed!');
        console.log(`✅ Migrated: ${migrated} members`);
        console.log(`⏭️  Skipped: ${skipped} members`);
        console.log(`📊 Total processed: ${migrated + skipped} members`);

        if (migrated > 0) {
            console.log('\n📝 Next steps:');
            console.log('1. Verify the data in your Firebase console');
            console.log('2. Test the team management in your admin panel');
            console.log('3. Check the public teams page');
        }

    } catch (error) {
        console.error('💥 Migration failed:', error);
        process.exit(1);
    }
}

// Simple prompt function for Node.js
function promptUser(question) {
    return new Promise((resolve) => {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Run the migration
migrateTeamData()
    .then(() => {
        console.log('🏁 Migration script finished.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Migration script failed:', error);
        process.exit(1);
    });