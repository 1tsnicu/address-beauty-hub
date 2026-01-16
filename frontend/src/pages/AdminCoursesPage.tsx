import React, { useState, useEffect } from 'react';
import { courseService, Course, CourseCreateInput, CourseUpdateInput } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<CourseCreateInput>>({
    name: '',
    nameRu: '',
    shortDescription: '',
    shortDescriptionRu: '',
    duration: '',
    durationRu: '',
    price: 0,
    currency: 'EUR',
    priceAlt: '',
    level: 'beginner',
    available: true,
    features: [],
    featuresRu: [],
    detailedDescription: '',
    detailedDescriptionRu: '',
    whatYouLearn: [],
    whatYouLearnRu: [],
    effects: [],
    effectsRu: [],
    whatYouGet: [],
    whatYouGetRu: [],
    practiceModels: 0,
    supportDays: 0,
    includesBranding: false,
    includesCareerStrategy: false,
    includesPortfolio: false,
    diploma: 'participation',
    displayOrder: 0,
  });
  const [tempFeature, setTempFeature] = useState({ ro: '', ru: '' });
  const [tempWhatYouLearn, setTempWhatYouLearn] = useState({ ro: '', ru: '' });
  const [tempEffect, setTempEffect] = useState({ ro: '', ru: '' });
  const [tempWhatYouGet, setTempWhatYouGet] = useState({ ro: '', ru: '' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (error) {
      toast.error('Eroare la încărcarea cursurilor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        name: course.name,
        nameRu: course.nameRu,
        shortDescription: course.shortDescription,
        shortDescriptionRu: course.shortDescriptionRu,
        duration: course.duration,
        durationRu: course.durationRu,
        price: course.price,
        currency: course.currency,
        priceAlt: course.priceAlt || '',
        level: course.level,
        available: course.available,
        features: [...course.features],
        featuresRu: [...course.featuresRu],
        detailedDescription: course.detailedDescription || '',
        detailedDescriptionRu: course.detailedDescriptionRu || '',
        whatYouLearn: [...course.whatYouLearn],
        whatYouLearnRu: [...course.whatYouLearnRu],
        effects: [...course.effects],
        effectsRu: [...course.effectsRu],
        whatYouGet: [...course.whatYouGet],
        whatYouGetRu: [...course.whatYouGetRu],
        practiceModels: course.practiceModels,
        supportDays: course.supportDays,
        includesBranding: course.includesBranding,
        includesCareerStrategy: course.includesCareerStrategy,
        includesPortfolio: course.includesPortfolio,
        diploma: course.diploma,
        displayOrder: course.displayOrder,
      });
    } else {
      setEditingCourse(null);
      setFormData({
        name: '',
        nameRu: '',
        shortDescription: '',
        shortDescriptionRu: '',
        duration: '',
        durationRu: '',
        price: 0,
        currency: 'EUR',
        priceAlt: '',
        level: 'beginner',
        available: true,
        features: [],
        featuresRu: [],
        detailedDescription: '',
        detailedDescriptionRu: '',
        whatYouLearn: [],
        whatYouLearnRu: [],
        effects: [],
        effectsRu: [],
        whatYouGet: [],
        whatYouGetRu: [],
        practiceModels: 0,
        supportDays: 0,
        includesBranding: false,
        includesCareerStrategy: false,
        includesPortfolio: false,
        diploma: 'participation',
        displayOrder: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    setTempFeature({ ro: '', ru: '' });
    setTempWhatYouLearn({ ro: '', ru: '' });
    setTempEffect({ ro: '', ru: '' });
    setTempWhatYouGet({ ro: '', ru: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingCourse) {
        await courseService.updateCourse({
          id: editingCourse.id,
          ...formData,
        } as CourseUpdateInput);
        toast.success('Curs actualizat cu succes!');
      } else {
        await courseService.createCourse(formData as CourseCreateInput);
        toast.success('Curs creat cu succes!');
      }
      handleCloseDialog();
      loadCourses();
    } catch (error) {
      toast.error('Eroare la salvarea cursului');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ești sigur că vrei să ștergi acest curs?')) {
      return;
    }
    try {
      await courseService.deleteCourse(id);
      toast.success('Curs șters cu succes!');
      loadCourses();
    } catch (error) {
      toast.error('Eroare la ștergerea cursului');
      console.error(error);
    }
  };

  const addFeature = () => {
    if (tempFeature.ro.trim() || tempFeature.ru.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), tempFeature.ro],
        featuresRu: [...(formData.featuresRu || []), tempFeature.ru],
      });
      setTempFeature({ ro: '', ru: '' });
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    const newFeaturesRu = [...(formData.featuresRu || [])];
    newFeatures.splice(index, 1);
    newFeaturesRu.splice(index, 1);
    setFormData({ ...formData, features: newFeatures, featuresRu: newFeaturesRu });
  };

  const addWhatYouLearn = () => {
    if (tempWhatYouLearn.ro.trim() || tempWhatYouLearn.ru.trim()) {
      setFormData({
        ...formData,
        whatYouLearn: [...(formData.whatYouLearn || []), tempWhatYouLearn.ro],
        whatYouLearnRu: [...(formData.whatYouLearnRu || []), tempWhatYouLearn.ru],
      });
      setTempWhatYouLearn({ ro: '', ru: '' });
    }
  };

  const removeWhatYouLearn = (index: number) => {
    const newList = [...(formData.whatYouLearn || [])];
    const newListRu = [...(formData.whatYouLearnRu || [])];
    newList.splice(index, 1);
    newListRu.splice(index, 1);
    setFormData({ ...formData, whatYouLearn: newList, whatYouLearnRu: newListRu });
  };

  const addEffect = () => {
    if (tempEffect.ro.trim() || tempEffect.ru.trim()) {
      setFormData({
        ...formData,
        effects: [...(formData.effects || []), tempEffect.ro],
        effectsRu: [...(formData.effectsRu || []), tempEffect.ru],
      });
      setTempEffect({ ro: '', ru: '' });
    }
  };

  const removeEffect = (index: number) => {
    const newList = [...(formData.effects || [])];
    const newListRu = [...(formData.effectsRu || [])];
    newList.splice(index, 1);
    newListRu.splice(index, 1);
    setFormData({ ...formData, effects: newList, effectsRu: newListRu });
  };

  const addWhatYouGet = () => {
    if (tempWhatYouGet.ro.trim() || tempWhatYouGet.ru.trim()) {
      setFormData({
        ...formData,
        whatYouGet: [...(formData.whatYouGet || []), tempWhatYouGet.ro],
        whatYouGetRu: [...(formData.whatYouGetRu || []), tempWhatYouGet.ru],
      });
      setTempWhatYouGet({ ro: '', ru: '' });
    }
  };

  const removeWhatYouGet = (index: number) => {
    const newList = [...(formData.whatYouGet || [])];
    const newListRu = [...(formData.whatYouGetRu || [])];
    newList.splice(index, 1);
    newListRu.splice(index, 1);
    setFormData({ ...formData, whatYouGet: newList, whatYouGetRu: newListRu });
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Se încarcă...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionare Cursuri</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Adaugă Curs
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead>Preț</TableHead>
                <TableHead>Disponibil</TableHead>
                <TableHead>Ordine</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant={course.level === 'beginner' ? 'secondary' : course.level === 'intermediate' ? 'default' : 'destructive'}>
                      {course.level}
                    </Badge>
                  </TableCell>
                  <TableCell>{course.price} {course.currency}</TableCell>
                  <TableCell>{course.available ? 'Da' : 'Nu'}</TableCell>
                  <TableCell>{course.displayOrder}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(course)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCourse ? 'Editează Curs' : 'Adaugă Curs Nou'}
            </DialogTitle>
            <DialogDescription>
              Completează toate câmpurile pentru a {editingCourse ? 'actualiza' : 'crea'} cursul.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nume (RO)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="nameRu">Nume (RU)</Label>
                <Input
                  id="nameRu"
                  value={formData.nameRu}
                  onChange={(e) => setFormData({ ...formData, nameRu: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shortDescription">Descriere Scurtă (RO)</Label>
                <Textarea
                  id="shortDescription"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="shortDescriptionRu">Descriere Scurtă (RU)</Label>
                <Textarea
                  id="shortDescriptionRu"
                  value={formData.shortDescriptionRu}
                  onChange={(e) => setFormData({ ...formData, shortDescriptionRu: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durată (RO)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="durationRu">Durată (RU)</Label>
                <Input
                  id="durationRu"
                  value={formData.durationRu}
                  onChange={(e) => setFormData({ ...formData, durationRu: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Preț</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="currency">Monedă</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => setFormData({ ...formData, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="MDL">MDL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priceAlt">Preț Alternativ</Label>
                <Input
                  id="priceAlt"
                  value={formData.priceAlt}
                  onChange={(e) => setFormData({ ...formData, priceAlt: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="level">Nivel</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
                    setFormData({ ...formData, level: value })
                  }
                >
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
                <Label htmlFor="diploma">Diplomă</Label>
                <Select
                  value={formData.diploma}
                  onValueChange={(value: 'participation' | 'completion' | 'professional') =>
                    setFormData({ ...formData, diploma: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="participation">Participare</SelectItem>
                    <SelectItem value="completion">Absolvire</SelectItem>
                    <SelectItem value="professional">Profesional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="displayOrder">Ordine Afișare</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="practiceModels">Modele Practice</Label>
                <Input
                  id="practiceModels"
                  type="number"
                  value={formData.practiceModels}
                  onChange={(e) => setFormData({ ...formData, practiceModels: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="supportDays">Zile Suport</Label>
                <Input
                  id="supportDays"
                  type="number"
                  value={formData.supportDays}
                  onChange={(e) => setFormData({ ...formData, supportDays: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">Disponibil</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includesBranding"
                checked={formData.includesBranding}
                onCheckedChange={(checked) => setFormData({ ...formData, includesBranding: checked })}
              />
              <Label htmlFor="includesBranding">Include Branding</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includesCareerStrategy"
                checked={formData.includesCareerStrategy}
                onCheckedChange={(checked) => setFormData({ ...formData, includesCareerStrategy: checked })}
              />
              <Label htmlFor="includesCareerStrategy">Include Strategie Carieră</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includesPortfolio"
                checked={formData.includesPortfolio}
                onCheckedChange={(checked) => setFormData({ ...formData, includesPortfolio: checked })}
              />
              <Label htmlFor="includesPortfolio">Include Portofoliu</Label>
            </div>

            <div>
              <Label htmlFor="detailedDescription">Descriere Detaliată (RO)</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="detailedDescriptionRu">Descriere Detaliată (RU)</Label>
              <Textarea
                id="detailedDescriptionRu"
                value={formData.detailedDescriptionRu}
                onChange={(e) => setFormData({ ...formData, detailedDescriptionRu: e.target.value })}
                rows={4}
              />
            </div>

            {/* Features */}
            <div>
              <Label>Caracteristici</Label>
              <div className="space-y-2">
                {(formData.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{feature}</Badge>
                    <Badge variant="outline">{(formData.featuresRu || [])[index]}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Caracteristică (RO)"
                    value={tempFeature.ro}
                    onChange={(e) => setTempFeature({ ...tempFeature, ro: e.target.value })}
                  />
                  <Input
                    placeholder="Caracteristică (RU)"
                    value={tempFeature.ru}
                    onChange={(e) => setTempFeature({ ...tempFeature, ru: e.target.value })}
                  />
                  <Button type="button" onClick={addFeature}>Adaugă</Button>
                </div>
              </div>
            </div>

            {/* What You Learn */}
            <div>
              <Label>Ce Vei Învăța</Label>
              <div className="space-y-2">
                {(formData.whatYouLearn || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{item}</Badge>
                    <Badge variant="outline">{(formData.whatYouLearnRu || [])[index]}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWhatYouLearn(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ce vei învăța (RO)"
                    value={tempWhatYouLearn.ro}
                    onChange={(e) => setTempWhatYouLearn({ ...tempWhatYouLearn, ro: e.target.value })}
                  />
                  <Input
                    placeholder="Ce vei învăța (RU)"
                    value={tempWhatYouLearn.ru}
                    onChange={(e) => setTempWhatYouLearn({ ...tempWhatYouLearn, ru: e.target.value })}
                  />
                  <Button type="button" onClick={addWhatYouLearn}>Adaugă</Button>
                </div>
              </div>
            </div>

            {/* Effects */}
            <div>
              <Label>Efecte/Volume</Label>
              <div className="space-y-2">
                {(formData.effects || []).map((effect, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{effect}</Badge>
                    <Badge variant="outline">{(formData.effectsRu || [])[index]}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEffect(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Efect (RO)"
                    value={tempEffect.ro}
                    onChange={(e) => setTempEffect({ ...tempEffect, ro: e.target.value })}
                  />
                  <Input
                    placeholder="Efect (RU)"
                    value={tempEffect.ru}
                    onChange={(e) => setTempEffect({ ...tempEffect, ru: e.target.value })}
                  />
                  <Button type="button" onClick={addEffect}>Adaugă</Button>
                </div>
              </div>
            </div>

            {/* What You Get */}
            <div>
              <Label>Ce Vei Primi</Label>
              <div className="space-y-2">
                {(formData.whatYouGet || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant="outline">{item}</Badge>
                    <Badge variant="outline">{(formData.whatYouGetRu || [])[index]}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWhatYouGet(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ce vei primi (RO)"
                    value={tempWhatYouGet.ro}
                    onChange={(e) => setTempWhatYouGet({ ...tempWhatYouGet, ro: e.target.value })}
                  />
                  <Input
                    placeholder="Ce vei primi (RU)"
                    value={tempWhatYouGet.ru}
                    onChange={(e) => setTempWhatYouGet({ ...tempWhatYouGet, ru: e.target.value })}
                  />
                  <Button type="button" onClick={addWhatYouGet}>Adaugă</Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                Anulează
              </Button>
              <Button onClick={handleSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Salvează
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoursesPage;
