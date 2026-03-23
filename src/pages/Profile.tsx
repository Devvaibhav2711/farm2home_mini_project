import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Edit2,
    Save,
    X,
    Loader2,
    Shield,
    Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    role: string;
    created_at: string;
}

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth', { state: { from: '/profile' } });
        }
    }, [user, authLoading, navigate]);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    toast.error('Failed to load profile');
                    return;
                }

                if (data) {
                    setProfile(data);
                    setFormData({
                        full_name: data.full_name || '',
                        email: data.email || '',
                        phone: data.phone || '',
                        address: data.address || '',
                        city: data.city || '',
                        state: data.state || '',
                        zip_code: data.zip_code || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                toast.error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        if (!user?.id) return;

        // Validation
        if (!formData.full_name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!formData.email.trim()) {
            toast.error('Email is required');
            return;
        }

        if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
            toast.error('Please enter a valid phone number');
            return;
        }

        try {
            setSaving(true);
            const { data, error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone || null,
                    address: formData.address || null,
                    city: formData.city || null,
                    state: formData.state || null,
                    zip_code: formData.zip_code || null,
                })
                .eq('id', user.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating profile:', error);
                toast.error('Failed to update profile');
                return;
            }

            setProfile(data);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                full_name: profile.full_name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
                city: profile.city || '',
                state: profile.state || '',
                zip_code: profile.zip_code || '',
            });
        }
        setIsEditing(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Profile not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-card rounded-2xl shadow-hover p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 rounded-full p-4">
                                <User className="h-12 w-12 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                    <Mail className="h-4 w-4" />
                                    {profile.email}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                        <Shield className="h-3 w-3" />
                                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        Member since {new Date(profile.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {!isEditing && (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="btn-hero gap-2"
                            >
                                <Edit2 className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-card rounded-2xl shadow-hover p-8">
                    <h2 className="text-2xl font-bold mb-6">Profile Information</h2>

                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Full Name
                            </label>
                            {isEditing ? (
                                <Input
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className="max-w-md"
                                />
                            ) : (
                                <p className="text-lg">{profile.full_name || 'Not provided'}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                Email Address
                            </label>
                            {isEditing ? (
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className="max-w-md"
                                    disabled
                                />
                            ) : (
                                <p className="text-lg">{profile.email}</p>
                            )}
                            {isEditing && (
                                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <Input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+91 1234567890"
                                    className="max-w-md"
                                />
                            ) : (
                                <p className="text-lg">{profile.phone || 'Not provided'}</p>
                            )}
                        </div>

                        {/* Address Section */}
                        <div className="pt-4 border-t border-border">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                Address Details
                            </h3>

                            <div className="space-y-4">
                                {/* Street Address */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Street Address
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="123 Main Street"
                                            className="max-w-md"
                                        />
                                    ) : (
                                        <p className="text-lg">{profile.address || 'Not provided'}</p>
                                    )}
                                </div>

                                {/* City, State, ZIP in a grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            City
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                            />
                                        ) : (
                                            <p className="text-lg">{profile.city || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            State
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                placeholder="State"
                                            />
                                        ) : (
                                            <p className="text-lg">{profile.state || 'Not provided'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            ZIP Code
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                name="zip_code"
                                                value={formData.zip_code}
                                                onChange={handleInputChange}
                                                placeholder="ZIP"
                                            />
                                        ) : (
                                            <p className="text-lg">{profile.zip_code || 'Not provided'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 mt-8 pt-6 border-t border-border">
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-hero gap-2"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                disabled={saving}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    )}
                </div>

                {/* Additional Info Card */}
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-6">
                    <h3 className="font-semibold text-primary mb-2">Keep Your Profile Updated</h3>
                    <p className="text-sm text-muted-foreground">
                        Maintaining accurate profile information helps us provide better service and ensures smooth order deliveries.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
