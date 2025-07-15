import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Clock, 
  Euro, 
  Award, 
  Check, 
  X,
  Star,
  Calendar,
  GraduationCap,
  User
} from 'lucide-react';
import { CourseService, Course } from '@/lib/firebaseService';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { formatPrice } = useCurrency();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    titleRu: '',
    duration: '',
    priceEur: 0,
    priceMdl: 0,
    description: '',
    descriptionRu: '',
    includes: [''],
    includesRu: [''],
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    image: '',
    featured: false,
    available: true,
    maxStudents: 12,
    currentStudents: 0,
    certificateIncluded: true,
    practicalHours: 0,
    theoryHours: 0,
    startDate: '',
    endDate: '',
    instructorName: '',
    instructorNameRu: '',
    instructorExperience: '',
    instructorImage: ''
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await CourseService.getAllCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Eroare la încărcarea cursurilor');
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    setFormData({
      title: '',
      titleRu: '',
      duration: '',
      priceEur: 0,
      priceMdl: 0,
      description: '',
      descriptionRu: '',
      includes: [''],
      includesRu: [''],
      level: 'beginner',
      image: '',
      featured: false,
      available: true,
      maxStudents: 12,
      currentStudents: 0,
      certificateIncluded: true,
      practicalHours: 0,
      theoryHours: 0,
      startDate: '',
      endDate: '',
      instructorName: '',
      instructorNameRu: '',
      instructorExperience: '',
      instructorImage: ''
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const openEditDialog = (course: Course) => {
    setFormData({
      title: course.title,
      titleRu: course.titleRu,
      duration: course.duration,
      priceEur: course.price.eur,
      priceMdl: course.price.mdl,
      description: course.description,
      descriptionRu: course.descriptionRu,
      includes: course.includes,
      includesRu: course.includesRu,
      level: course.level,
      image: course.image,
      featured: course.featured,
      available: course.available,
      maxStudents: course.maxStudents,
      currentStudents: course.currentStudents,
      certificateIncluded: course.certificateIncluded,
      practicalHours: course.practicalHours,
      theoryHours: course.theoryHours,
      startDate: course.startDate || '',
      endDate: course.endDate || '',
      instructorName: course.instructor.name,
      instructorNameRu: course.instructor.nameRu,
      instructorExperience: course.instructor.experience,
      instructorImage: course.instructor.image
    });
    setSelectedCourse(course);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const courseData = {
        title: formData.title,
        titleRu: formData.titleRu,
        duration: formData.duration,
        price: {
          eur: formData.priceEur,
          mdl: formData.priceMdl
        },
        description: formData.description,
        descriptionRu: formData.descriptionRu,
        includes: formData.includes.filter(item => item.trim() !== ''),
        includesRu: formData.includesRu.filter(item => item.trim() !== ''),
        level: formData.level,
        image: formData.image,
        featured: formData.featured,
        available: formData.available,
        maxStudents: formData.maxStudents,
        currentStudents: formData.currentStudents,
        certificateIncluded: formData.certificateIncluded,
        practicalHours: formData.practicalHours,
        theoryHours: formData.theoryHours,
        startDate: formData.startDate,
        endDate: formData.endDate,
        instructor: {
          name: formData.instructorName,
          nameRu: formData.instructorNameRu,
          experience: formData.instructorExperience,
          image: formData.instructorImage
        }
      };

      if (isEditing && selectedCourse) {
        await CourseService.updateCourse(selectedCourse.id, courseData);
        toast.success('Cursul a fost actualizat cu succes');
      } else {
        await CourseService.addCourse(courseData);
        toast.success('Cursul a fost adăugat cu succes');
      }

      setIsDialogOpen(false);
      loadCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Eroare la salvarea cursului');
    }
  };

  const handleDelete = async (courseId: string) => {
    if (window.confirm('Sigur vrei să ștergi acest curs?')) {
      try {
        await CourseService.deleteCourse(courseId);
        toast.success('Cursul a fost șters cu succes');
        loadCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Eroare la ștergerea cursului');
      }
    }
  };

  const addIncludeItem = (lang: 'ro' | 'ru') => {
    if (lang === 'ro') {
      setFormData(prev => ({ ...prev, includes: [...prev.includes, ''] }));
    } else {
      setFormData(prev => ({ ...prev, includesRu: [...prev.includesRu, ''] }));
    }
  };

  const removeIncludeItem = (index: number, lang: 'ro' | 'ru') => {
    if (lang === 'ro') {
      setFormData(prev => ({ 
        ...prev, 
        includes: prev.includes.filter((_, i) => i !== index) 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        includesRu: prev.includesRu.filter((_, i) => i !== index) 
      }));
    }
  };

  const updateIncludeItem = (index: number, value: string, lang: 'ro' | 'ru') => {
    if (lang === 'ro') {
      setFormData(prev => ({
        ...prev,
        includes: prev.includes.map((item, i) => i === index ? value : item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        includesRu: prev.includesRu.map((item, i) => i === index ? value : item)
      }));
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Începător</Badge>;
      case 'intermediate':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Intermediar</Badge>;
      case 'advanced':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Avansat</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gestionare Cursuri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p>Se încarcă cursurile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Gestionare Cursuri
              </CardTitle>
              <CardDescription>
                Administrează cursurile de formare disponibile
              </CardDescription>
            </div>
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Adaugă Curs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nu există cursuri
              </h3>
              <p className="text-gray-500 mb-4">
                Începe prin a adăuga primul curs.
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Adaugă primul curs
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curs</TableHead>
                  <TableHead>Durată</TableHead>
                  <TableHead>Preț</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Studenți</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image || '/placeholder.svg'}
                          alt={course.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{course.title}</div>
                          <div className="text-sm text-gray-500">{course.titleRu}</div>
                          {course.featured && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800 mt-1">
                              <Star className="w-3 h-3 mr-1" />
                              Recomandat
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {course.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Euro className="w-4 h-4 text-gray-400" />
                          €{course.price.eur}
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.price.mdl} MDL
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getLevelBadge(course.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        {course.currentStudents}/{course.maxStudents}
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.available ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Check className="w-3 h-3 mr-1" />
                          Disponibil
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <X className="w-3 h-3 mr-1" />
                          Indisponibil
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(course)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Course Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editează Cursul' : 'Adaugă Curs Nou'}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifică detaliile cursului' : 'Completează informațiile pentru noul curs'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informații de bază</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Titlu (RO)</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Numele cursului în română"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleRu">Titlu (RU)</Label>
                    <Input
                      id="titleRu"
                      value={formData.titleRu}
                      onChange={(e) => setFormData({...formData, titleRu: e.target.value})}
                      placeholder="Numele cursului în rusă"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Durată</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="ex: 5 zile"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Nivel</Label>
                    <Select value={formData.level} onValueChange={(value: any) => setFormData({...formData, level: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Începător</SelectItem>
                        <SelectItem value="intermediate">Intermediar</SelectItem>
                        <SelectItem value="advanced">Avansat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="image">URL Imagine</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Prețuri</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceEur">Preț EUR</Label>
                    <Input
                      id="priceEur"
                      type="number"
                      value={formData.priceEur}
                      onChange={(e) => setFormData({...formData, priceEur: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceMdl">Preț MDL</Label>
                    <Input
                      id="priceMdl"
                      type="number"
                      value={formData.priceMdl}
                      onChange={(e) => setFormData({...formData, priceMdl: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Descriptions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Descrieri</h3>
                <div>
                  <Label htmlFor="description">Descriere (RO)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionRu">Descriere (RU)</Label>
                  <Textarea
                    id="descriptionRu"
                    value={formData.descriptionRu}
                    onChange={(e) => setFormData({...formData, descriptionRu: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Course Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Detalii curs</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="maxStudents">Studenți max</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({...formData, maxStudents: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="practicalHours">Ore practice</Label>
                    <Input
                      id="practicalHours"
                      type="number"
                      value={formData.practicalHours}
                      onChange={(e) => setFormData({...formData, practicalHours: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="theoryHours">Ore teorie</Label>
                    <Input
                      id="theoryHours"
                      type="number"
                      value={formData.theoryHours}
                      onChange={(e) => setFormData({...formData, theoryHours: Number(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="certificateIncluded"
                      checked={formData.certificateIncluded}
                      onChange={(e) => setFormData({...formData, certificateIncluded: e.target.checked})}
                    />
                    <Label htmlFor="certificateIncluded">Include certificat</Label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    <Label htmlFor="featured">Curs recomandat</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="available"
                      checked={formData.available}
                      onChange={(e) => setFormData({...formData, available: e.target.checked})}
                    />
                    <Label htmlFor="available">Disponibil</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Instructor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Instructor</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructorName">Nume instructor (RO)</Label>
                    <Input
                      id="instructorName"
                      value={formData.instructorName}
                      onChange={(e) => setFormData({...formData, instructorName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructorNameRu">Nume instructor (RU)</Label>
                    <Input
                      id="instructorNameRu"
                      value={formData.instructorNameRu}
                      onChange={(e) => setFormData({...formData, instructorNameRu: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructorExperience">Experiență</Label>
                    <Input
                      id="instructorExperience"
                      value={formData.instructorExperience}
                      onChange={(e) => setFormData({...formData, instructorExperience: e.target.value})}
                      placeholder="ex: 5+ ani experiență"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructorImage">URL poză instructor</Label>
                    <Input
                      id="instructorImage"
                      value={formData.instructorImage}
                      onChange={(e) => setFormData({...formData, instructorImage: e.target.value})}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleSave}>
              {isEditing ? 'Actualizează' : 'Adaugă'} Curs
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
