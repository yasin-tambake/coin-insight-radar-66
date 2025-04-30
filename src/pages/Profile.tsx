
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  
  // If not logged in, redirect to auth page
  if (!user) {
    navigate('/auth');
    return null;
  }
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      await updateProfile({
        name,
        email
      });
      
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };
  
  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        
        <Card className="bg-crypto-dark border-gray-800 mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    className="bg-gray-800 border-gray-700"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button type="submit">
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-crypto-dark border-gray-800 mb-6">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-md">
                <div>
                  <div className="font-medium">Password</div>
                  <div className="text-sm text-gray-400">Change your account password</div>
                </div>
                <Button variant="outline" size="sm">
                  Change
                </Button>
              </div>
              
              <div className="flex justify-between items-center py-3 px-4 bg-gray-800 rounded-md">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-400">Add additional security to your account</div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-crypto-dark border-gray-800">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              These actions are irreversible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-red-900 rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Delete Account</h3>
                <p className="text-gray-400 text-sm mb-4">
                  This will permanently delete your account and all associated data.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
              
              <div className="border border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium mb-2">Sign Out</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Sign out of your account on this device.
                </p>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
