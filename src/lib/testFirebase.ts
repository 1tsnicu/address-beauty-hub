import { db } from './firebase';
import { collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';

// Test Firebase connection and permissions
export const testFirebaseConnection = async () => {
  console.log('🔍 Testing Firebase connection...');
  
  try {
    // Test 1: Try to read from a collection
    console.log('📖 Testing read access...');
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    console.log(`✅ Read access OK - Found ${snapshot.size} documents`);
    
    // Test 2: Try to write to a collection
    console.log('✍️ Testing write access...');
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Firebase connection test',
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substr(2, 9)
    });
    console.log(`✅ Write access OK - Created document: ${testDoc.id}`);
    
    // Test 3: Try to delete the test document
    console.log('🗑️ Testing delete access...');
    await deleteDoc(doc(db, 'test', testDoc.id));
    console.log('✅ Delete access OK');
    
    console.log('🎉 All Firebase tests passed!');
    return {
      success: true,
      message: 'Firebase connection is working properly'
    };
    
  } catch (error: any) {
    console.error('❌ Firebase test failed:', error);
    
    let errorMessage = 'Unknown error occurred';
    let suggestions: string[] = [];
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied - Firestore security rules are blocking access';
      suggestions = [
        'Update Firestore security rules in Firebase Console',
        'Go to Firebase Console → Firestore Database → Rules',
        'Copy the rules from firestore.rules file in your project',
        'Publish the new rules'
      ];
    } else if (error.code === 'unauthenticated') {
      errorMessage = 'Unauthenticated - User needs to sign in';
      suggestions = [
        'Implement user authentication',
        'Allow unauthenticated access in Firestore rules',
        'Sign in with a test account'
      ];
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firebase service is unavailable';
      suggestions = [
        'Check internet connection',
        'Verify Firebase project configuration',
        'Try again later'
      ];
    }
    
    return {
      success: false,
      error: errorMessage,
      code: error.code,
      suggestions
    };
  }
};

// Test specific collections that we'll use
export const testDatabaseCollections = async () => {
  console.log('🧪 Testing database collections...');
  
  const collections = ['products', 'courses', 'customers'];
  const results: Record<string, any> = {};
  
  for (const collectionName of collections) {
    try {
      console.log(`📋 Testing ${collectionName} collection...`);
      const snapshot = await getDocs(collection(db, collectionName));
      results[collectionName] = {
        success: true,
        count: snapshot.size,
        message: `Found ${snapshot.size} documents`
      };
      console.log(`✅ ${collectionName}: ${snapshot.size} documents`);
    } catch (error: any) {
      results[collectionName] = {
        success: false,
        error: error.message,
        code: error.code
      };
      console.error(`❌ ${collectionName} failed:`, error.message);
    }
  }
  
  return results;
};
