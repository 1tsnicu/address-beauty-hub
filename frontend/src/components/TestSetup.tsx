import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { setupTestData, createAdminUser, seedSampleData } from '@/utils/setupTestData';
import { toast } from 'sonner';

const TestSetup = () => {
  const [loading, setLoading] = useState(false);

  const handleSetupAll = async () => {
    setLoading(true);
    try {
      await setupTestData();
      toast.success('Setup completed successfully!');
    } catch (error) {
      toast.error('Setup failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    setLoading(true);
    try {
      await createAdminUser();
      toast.success('Admin user created! Email: admin@test.com, Password: admin123456');
    } catch (error) {
      toast.error('Failed to create admin user: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    try {
      await seedSampleData();
      toast.success('Sample data added successfully!');
    } catch (error) {
      toast.error('Failed to seed data: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary text-center">
              Test Setup Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground mb-6">
              Use this page to set up test data and admin users for development.
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={handleSetupAll} 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? 'Setting up...' : 'Setup All (Admin User + Sample Data)'}
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={handleCreateAdmin} 
                  variant="outline"
                  disabled={loading}
                >
                  Create Admin User
                </Button>
                
                <Button 
                  onClick={handleSeedData} 
                  variant="outline"
                  disabled={loading}
                >
                  Add Sample Products
                </Button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Admin Credentials:</h3>
              <p className="text-blue-700 text-sm">
                <strong>Email:</strong> admin@test.com<br />
                <strong>Password:</strong> admin123456
              </p>
            </div>
            
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Next Steps:</h3>
              <ol className="text-green-700 text-sm space-y-1">
                <li>1. Click "Setup All" to create admin user and sample data</li>
                <li>2. Go to <a href="/admin/login" className="underline">/admin/login</a> to login</li>
                <li>3. Use admin credentials to access dashboard</li>
                <li>4. Test the edit functionality on products</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestSetup;