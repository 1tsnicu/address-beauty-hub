import { supabase } from '@/lib/supabaseClient';

export interface Course {
  id: string;
  name: string;
  nameRu: string;
  shortDescription: string;
  shortDescriptionRu: string;
  duration: string;
  durationRu: string;
  price: number;
  currency: string;
  priceAlt: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  available: boolean;
  features: string[];
  featuresRu: string[];
  detailedDescription: string | null;
  detailedDescriptionRu: string | null;
  whatYouLearn: string[];
  whatYouLearnRu: string[];
  effects: string[];
  effectsRu: string[];
  whatYouGet: string[];
  whatYouGetRu: string[];
  practiceModels: number;
  supportDays: number;
  includesBranding: boolean;
  includesCareerStrategy: boolean;
  includesPortfolio: boolean;
  diploma: 'participation' | 'completion' | 'professional';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateInput {
  name: string;
  nameRu: string;
  shortDescription: string;
  shortDescriptionRu: string;
  duration: string;
  durationRu: string;
  price: number;
  currency?: string;
  priceAlt?: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  available?: boolean;
  features: string[];
  featuresRu: string[];
  detailedDescription?: string | null;
  detailedDescriptionRu?: string | null;
  whatYouLearn: string[];
  whatYouLearnRu: string[];
  effects: string[];
  effectsRu: string[];
  whatYouGet: string[];
  whatYouGetRu: string[];
  practiceModels: number;
  supportDays: number;
  includesBranding?: boolean;
  includesCareerStrategy?: boolean;
  includesPortfolio?: boolean;
  diploma?: 'participation' | 'completion' | 'professional';
  displayOrder?: number;
}

export interface CourseUpdateInput extends Partial<CourseCreateInput> {
  id: string;
}

class CourseService {
  /**
   * Obține toate cursurile disponibile, sortate după display_order
   */
  async getAllCourses(): Promise<Course[]> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Eroare la încărcarea cursurilor: ${error.message}`);
      }

      return this.mapCoursesFromDb(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  /**
   * Obține un curs după ID
   */
  async getCourseById(id: string): Promise<Course | null> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Cursul nu există
        }
        throw new Error(`Eroare la încărcarea cursului: ${error.message}`);
      }

      return this.mapCourseFromDb(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  /**
   * Creează un curs nou
   */
  async createCourse(courseData: CourseCreateInput): Promise<Course> {
    try {
      const dbData = this.mapCourseToDb(courseData);
      
      const { data, error } = await supabase
        .from('courses')
        .insert([dbData])
        .select()
        .single();

      if (error) {
        throw new Error(`Eroare la crearea cursului: ${error.message}`);
      }

      return this.mapCourseFromDb(data);
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  /**
   * Actualizează un curs existent
   */
  async updateCourse(courseData: CourseUpdateInput): Promise<Course> {
    try {
      const { id, ...updateData } = courseData;
      const dbData = this.mapCourseToDb(updateData as CourseCreateInput);
      
      const { data, error } = await supabase
        .from('courses')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`Eroare la actualizarea cursului: ${error.message}`);
      }

      return this.mapCourseFromDb(data);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  /**
   * Șterge un curs
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Eroare la ștergerea cursului: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  /**
   * Mapează datele din baza de date la interfața Course
   */
  private mapCourseFromDb(dbCourse: any): Course {
    return {
      id: dbCourse.id,
      name: dbCourse.name,
      nameRu: dbCourse.name_ru,
      shortDescription: dbCourse.short_description,
      shortDescriptionRu: dbCourse.short_description_ru,
      duration: dbCourse.duration,
      durationRu: dbCourse.duration_ru,
      price: parseFloat(dbCourse.price) || 0,
      currency: dbCourse.currency || 'EUR',
      priceAlt: dbCourse.price_alt,
      level: dbCourse.level,
      available: dbCourse.available ?? true,
      features: Array.isArray(dbCourse.features) ? dbCourse.features : [],
      featuresRu: Array.isArray(dbCourse.features_ru) ? dbCourse.features_ru : [],
      detailedDescription: dbCourse.detailed_description,
      detailedDescriptionRu: dbCourse.detailed_description_ru,
      whatYouLearn: Array.isArray(dbCourse.what_you_learn) ? dbCourse.what_you_learn : [],
      whatYouLearnRu: Array.isArray(dbCourse.what_you_learn_ru) ? dbCourse.what_you_learn_ru : [],
      effects: Array.isArray(dbCourse.effects) ? dbCourse.effects : [],
      effectsRu: Array.isArray(dbCourse.effects_ru) ? dbCourse.effects_ru : [],
      whatYouGet: Array.isArray(dbCourse.what_you_get) ? dbCourse.what_you_get : [],
      whatYouGetRu: Array.isArray(dbCourse.what_you_get_ru) ? dbCourse.what_you_get_ru : [],
      practiceModels: dbCourse.practice_models || 0,
      supportDays: dbCourse.support_days || 0,
      includesBranding: dbCourse.includes_branding ?? false,
      includesCareerStrategy: dbCourse.includes_career_strategy ?? false,
      includesPortfolio: dbCourse.includes_portfolio ?? false,
      diploma: dbCourse.diploma || 'participation',
      displayOrder: dbCourse.display_order || 0,
      createdAt: dbCourse.created_at,
      updatedAt: dbCourse.updated_at,
    };
  }

  /**
   * Mapează mai multe cursuri din baza de date
   */
  private mapCoursesFromDb(dbCourses: any[]): Course[] {
    return dbCourses.map(course => this.mapCourseFromDb(course));
  }

  /**
   * Mapează datele din interfața Course la formatul bazei de date
   */
  private mapCourseToDb(courseData: Partial<CourseCreateInput>): any {
    const dbData: any = {};

    if (courseData.name !== undefined) dbData.name = courseData.name;
    if (courseData.nameRu !== undefined) dbData.name_ru = courseData.nameRu;
    if (courseData.shortDescription !== undefined) dbData.short_description = courseData.shortDescription;
    if (courseData.shortDescriptionRu !== undefined) dbData.short_description_ru = courseData.shortDescriptionRu;
    if (courseData.duration !== undefined) dbData.duration = courseData.duration;
    if (courseData.durationRu !== undefined) dbData.duration_ru = courseData.durationRu;
    if (courseData.price !== undefined) dbData.price = courseData.price;
    if (courseData.currency !== undefined) dbData.currency = courseData.currency || 'EUR';
    if (courseData.priceAlt !== undefined) dbData.price_alt = courseData.priceAlt;
    if (courseData.level !== undefined) dbData.level = courseData.level;
    if (courseData.available !== undefined) dbData.available = courseData.available ?? true;
    if (courseData.features !== undefined) dbData.features = courseData.features;
    if (courseData.featuresRu !== undefined) dbData.features_ru = courseData.featuresRu;
    if (courseData.detailedDescription !== undefined) dbData.detailed_description = courseData.detailedDescription;
    if (courseData.detailedDescriptionRu !== undefined) dbData.detailed_description_ru = courseData.detailedDescriptionRu;
    if (courseData.whatYouLearn !== undefined) dbData.what_you_learn = courseData.whatYouLearn;
    if (courseData.whatYouLearnRu !== undefined) dbData.what_you_learn_ru = courseData.whatYouLearnRu;
    if (courseData.effects !== undefined) dbData.effects = courseData.effects;
    if (courseData.effectsRu !== undefined) dbData.effects_ru = courseData.effectsRu;
    if (courseData.whatYouGet !== undefined) dbData.what_you_get = courseData.whatYouGet;
    if (courseData.whatYouGetRu !== undefined) dbData.what_you_get_ru = courseData.whatYouGetRu;
    if (courseData.practiceModels !== undefined) dbData.practice_models = courseData.practiceModels;
    if (courseData.supportDays !== undefined) dbData.support_days = courseData.supportDays;
    if (courseData.includesBranding !== undefined) dbData.includes_branding = courseData.includesBranding ?? false;
    if (courseData.includesCareerStrategy !== undefined) dbData.includes_career_strategy = courseData.includesCareerStrategy ?? false;
    if (courseData.includesPortfolio !== undefined) dbData.includes_portfolio = courseData.includesPortfolio ?? false;
    if (courseData.diploma !== undefined) dbData.diploma = courseData.diploma || 'participation';
    if (courseData.displayOrder !== undefined) dbData.display_order = courseData.displayOrder ?? 0;

    return dbData;
  }
}

export const courseService = new CourseService();
