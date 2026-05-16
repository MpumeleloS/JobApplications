import { useEffect, useState } from 'react';
import { companiesAPI } from '@/services/api';
import type { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Building2,
  Globe,
  MapPin,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    location: '',
    industry: '',
    notes: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await companiesAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCompany) {
        await companiesAPI.update(editingCompany.id, formData);
        toast.success('Company updated successfully');
      } else {
        await companiesAPI.create(formData);
        toast.success('Company added successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      fetchCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company? All associated applications will also be deleted.')) return;
    try {
      await companiesAPI.delete(id);
      toast.success('Company deleted successfully');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to delete company');
    }
  };

  const openEditDialog = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      website: company.website || '',
      location: company.location || '',
      industry: company.industry || '',
      notes: company.notes || '',
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCompany(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      website: '',
      location: '',
      industry: '',
      notes: '',
    });
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage companies you've applied to</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCompany ? 'Edit Company' : 'Add New Company'}</DialogTitle>
              <DialogDescription>
                {editingCompany ? 'Update the company details below.' : 'Add a new company to your list.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Google"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g. Technology"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Mountain View, CA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any notes about this company..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCompany ? 'Update' : 'Add'} Company
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No companies found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {searchTerm ? 'Try adjusting your search' : 'Start by adding your first company'}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      {company.industry && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{company.industry}</span>
                        </div>
                      )}
                      {company.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{company.location}</span>
                        </div>
                      )}
                      {company.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate"
                          >
                            {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {company.applicationCount || 0} application{(company.applicationCount || 0) !== 1 ? 's' : ''}
                      </span>
                      <div className="flex items-center gap-1">
                        {company.website && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(company)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(company.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {company.notes && (
                      <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {company.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
