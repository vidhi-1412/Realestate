import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { ImageCropper } from './ImageCropper';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Upload, Image as ImageIcon } from 'lucide-react';

export function AdminPanel() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // Form States
  const [newProject, setNewProject] = useState({ name: '', description: '', imagePath: '' });
  const [newClient, setNewClient] = useState({ name: '', description: '', designation: '', imagePath: '' });

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [selectedFileStr, setSelectedFileStr] = useState<string | null>(null);
  const [croppingFor, setCroppingFor] = useState<'project' | 'client' | null>(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const p = await api.getProjects();
      setProjects(p);
      const c = await api.getClients();
      setClients(c);
      const s = await api.getContactSubmissions();
      setSubmissions(s);
      const n = await api.getNewsletterSubscriptions();
      setSubscriptions(n);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'project' | 'client') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedFileStr(reader.result as string);
        setCroppingFor(type);
        setCropperOpen(true);
      });
      reader.readAsDataURL(file);
      // Reset input
      e.target.value = '';
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropperOpen(false);
    const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
    try {
      const { path } = await api.uploadImage(file);
      if (croppingFor === 'project') {
        setNewProject(prev => ({ ...prev, imagePath: path }));
      } else {
        setNewClient(prev => ({ ...prev, imagePath: path }));
      }
      toast.success("Image uploaded successfully");
    } catch (e) {
      toast.error("Failed to upload image");
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addProject(newProject);
      toast.success("Project added!");
      setNewProject({ name: '', description: '', imagePath: '' });
      loadAll();
    } catch (e) {
      toast.error("Failed to add project");
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.addClient(newClient);
      toast.success("Client added!");
      setNewClient({ name: '', description: '', designation: '', imagePath: '' });
      loadAll();
    } catch (e) {
      toast.error("Failed to add client");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <Link to="/">
            <Button variant="ghost">View Live Site</Button>
          </Link>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-lg border">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="contact">Contact Messages</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          </TabsList>

          {/* PROJECTS TAB */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5"/> Add New Project</CardTitle>
                  <CardDescription>Upload image and details.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProject} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Project Name</Label>
                      <Input 
                        required 
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        required 
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image (Will be cropped to 4:3)</Label>
                      <div className="flex items-center gap-4">
                        <Input id="project-file" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'project')} />
                        <Button type="button" variant="outline" onClick={() => document.getElementById('project-file')?.click()}>
                          <Upload className="w-4 h-4 mr-2" /> Select Image
                        </Button>
                        {newProject.imagePath && <span className="text-sm text-green-600 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Ready</span>}
                      </div>
                    </div>
                    <Button type="submit" disabled={!newProject.imagePath} className="w-full">Add Project</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {projects.length === 0 && <p className="text-gray-500 text-center py-4">No projects yet.</p>}
                    {projects.map((p) => (
                      <div key={p.id} className="flex gap-4 items-start border p-3 rounded-lg bg-white shadow-sm">
                         <div className="w-24 h-16 bg-gray-200 shrink-0 rounded overflow-hidden">
                           {p.imageUrl && <img src={p.imageUrl} className="w-full h-full object-cover" />}
                         </div>
                         <div>
                           <p className="font-bold">{p.name}</p>
                           <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CLIENTS TAB */}
          <TabsContent value="clients">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5"/> Add New Client</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddClient} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Input 
                        required 
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Input 
                        required 
                        placeholder="CEO, etc."
                        value={newClient.designation}
                        onChange={(e) => setNewClient({...newClient, designation: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Testimonial</Label>
                      <Textarea 
                        required 
                        value={newClient.description}
                        onChange={(e) => setNewClient({...newClient, description: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image (Will be cropped to 1:1)</Label>
                      <div className="flex items-center gap-4">
                        <Input id="client-file" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, 'client')} />
                         <Button type="button" variant="outline" onClick={() => document.getElementById('client-file')?.click()}>
                          <Upload className="w-4 h-4 mr-2" /> Select Image
                        </Button>
                        {newClient.imagePath && <span className="text-sm text-green-600 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Ready</span>}
                      </div>
                    </div>
                    <Button type="submit" disabled={!newClient.imagePath} className="w-full">Add Client</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {clients.length === 0 && <p className="text-gray-500 text-center py-4">No clients yet.</p>}
                    {clients.map((c) => (
                      <div key={c.id} className="flex gap-4 items-center border p-3 rounded-lg bg-white shadow-sm">
                         <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                           {c.imageUrl && <img src={c.imageUrl} className="w-full h-full object-cover" />}
                         </div>
                         <div>
                           <p className="font-bold">{c.name}</p>
                           <p className="text-xs text-gray-500">{c.designation}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CONTACT TAB */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Form Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>City</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center h-24 text-gray-500">No submissions yet.</TableCell>
                        </TableRow>
                      )}
                      {submissions.map((s) => (
                        <TableRow key={s.id}>
                          <TableCell>{new Date(s.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{s.fullName}</TableCell>
                          <TableCell>{s.email}</TableCell>
                          <TableCell>{s.mobile}</TableCell>
                          <TableCell>{s.city}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NEWSLETTER TAB */}
          <TabsContent value="newsletter">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center h-24 text-gray-500">No subscriptions yet.</TableCell>
                        </TableRow>
                      )}
                      {subscriptions.map((s: any, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>{s.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ImageCropper 
          open={cropperOpen}
          imageSrc={selectedFileStr}
          aspect={croppingFor === 'client' ? 1 : 4/3}
          onCancel={() => setCropperOpen(false)}
          onCropComplete={handleCropComplete}
        />
      </div>
    </div>
  );
}
