import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Users, Star, Award, BookOpen, Calendar, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

// Local Education Data type definition
interface School {
  name: string;
  type: 'elementary' | 'middle' | 'high';
  rating: string;
  score: number;
  enrollment: number;
  distance: string;
  programs: string[];
  testScores: { reading: number; math: number };
}

interface EducationData {
  district: string;
  districtRating: string;
  graduationRate: number;
  collegeReadinessRate: number;
  studentTeacherRatio: number;
  totalStudents: number;
  schoolsCount: number;
  averageTestScores: {
    reading: number;
    math: number;
    science: number;
  };
  educationalAttainment: {
    highSchoolOrHigher: number;
    bachelorsOrHigher: number;
    graduateOrProfessional: number;
  };
  schools: School[];
  lastUpdated: string;
}

interface SchoolDistrictDetailsProps {
  communityId: string;
  communityName: string;
}

export function SchoolDistrictDetails({ communityId, communityName }: SchoolDistrictDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [educationData, setEducationData] = useState<EducationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch education data from Census API
  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For now, use fallback data until we implement the actual API call
        // TODO: Implement CensusService.getEducationData method
        setError('Education data temporarily unavailable');
        setEducationData(getFallbackEducationData(communityId));
      } catch (err) {
        console.error('Error fetching education data:', err);
        setError('Error loading education data');
        // Fallback to sample data
        setEducationData(getFallbackEducationData(communityId));
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, [communityId]);

  // Fallback education data for demo purposes - OBVIOUSLY SAMPLE DATA
  const getFallbackEducationData = (id: string): EducationData => {
    const fallbackData = {
      westlake: {
        district: '🔮 Sample Perfect School District',
        districtRating: 'A+++', // Obviously fake rating
        graduationRate: 100.0, // Perfect round number
        collegeReadinessRate: 100.0, // Perfect round number
        studentTeacherRatio: 10.0, // Perfect round number
        totalStudents: 10000, // Perfect round number
        schoolsCount: 20, // Perfect round number
        averageTestScores: {
          reading: 100, // Perfect scores
          math: 100,
          science: 100
        },
        educationalAttainment: {
          highSchoolOrHigher: 100.0, // Perfect round numbers
          bachelorsOrHigher: 100.0,
          graduateOrProfessional: 80.0
        },
        schools: [
          {
            name: '🔮 Sample Perfect Elementary',
            type: 'elementary' as const,
            rating: 'A+++', // Obviously fake rating
            score: 100, // Perfect score
            enrollment: 500, // Round number
            distance: '1.0 miles', // Round number
            programs: ['🔮 Sample STEM', '🔮 Sample Dual Language', '🔮 Sample Gifted'],
            testScores: { reading: 100, math: 100 }
          },
          {
            name: '🔮 Sample Amazing Middle School',
            type: 'middle' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 750, // Round number
            distance: '1.5 miles',
            programs: ['🔮 Sample Advanced Math', '🔮 Sample Band', '🔮 Sample Athletics'],
            testScores: { reading: 100, math: 100 }
          },
          {
            name: '🔮 Sample Incredible High School',
            type: 'high' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 3000, // Round number
            distance: '2.0 miles',
            programs: ['🔮 Sample AP Courses', '🔮 Sample IB Program', '🔮 Sample Arts Academy'],
            testScores: { reading: 100, math: 100 }
          }
        ],
        lastUpdated: new Date().toISOString()
      },
      plano: {
        district: '🔮 Sample Plano Super District',
        districtRating: 'A+++',
        graduationRate: 100.0,
        collegeReadinessRate: 100.0,
        studentTeacherRatio: 10.0,
        totalStudents: 60000,
        schoolsCount: 100,
        averageTestScores: {
          reading: 100,
          math: 100,
          science: 100
        },
        educationalAttainment: {
          highSchoolOrHigher: 100.0,
          bachelorsOrHigher: 90.0,
          graduateOrProfessional: 70.0
        },
        schools: [
          {
            name: '🔮 Sample Plano Elementary',
            type: 'elementary' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 600, // Round number
            distance: '0.5 miles',
            programs: ['🔮 Sample STEM', '🔮 Sample Fine Arts', '🔮 Sample ESL'],
            testScores: { reading: 100, math: 100 }
          },
          {
            name: '🔮 Sample Plano Middle School',
            type: 'middle' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 900, // Round number
            distance: '1.0 miles',
            programs: ['🔮 Sample Pre-AP', '🔮 Sample Orchestra', '🔮 Sample Robotics'],
            testScores: { reading: 100, math: 100 }
          },
          {
            name: '🔮 Sample Plano High School',
            type: 'high' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 3500, // Round number
            distance: '2.0 miles',
            programs: ['🔮 Sample AP Courses', '🔮 Sample Career Tech', '🔮 Sample Fine Arts'],
            testScores: { reading: 100, math: 100 }
          }
        ],
        lastUpdated: new Date().toISOString()
      },
      katy: {
        district: '🔮 Sample Katy Super District',
        districtRating: 'A+++',
        graduationRate: 100.0,
        collegeReadinessRate: 100.0,
        studentTeacherRatio: 10.0,
        totalStudents: 90000, // Round number
        schoolsCount: 100, // Round number
        averageTestScores: {
          reading: 100,
          math: 100,
          science: 100
        },
        educationalAttainment: {
          highSchoolOrHigher: 100.0,
          bachelorsOrHigher: 85.0,
          graduateOrProfessional: 65.0
        },
        schools: [
          {
            name: '🔮 Sample Katy Elementary',
            type: 'elementary' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 500, // Round number
            distance: '0.5 miles',
            programs: ['🔮 Sample Dual Language', '🔮 Sample Technology', '🔮 Sample Music'],
            testScores: { reading: 100, math: 100 }
          },
          {
            name: '🔮 Sample Katy Middle School',
            type: 'middle' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 750, // Round number
            distance: '1.0 miles',
            programs: ['🔮 Sample Pre-AP', '🔮 Sample Band', '🔮 Sample Athletics'],
            testScores: { reading: 100, math: 100 }
          },
          {
            name: '🔮 Sample Katy High School',
            type: 'high' as const,
            rating: 'A+++',
            score: 100,
            enrollment: 3000, // Round number
            distance: '2.0 miles',
            programs: ['🔮 Sample AP Courses', '🔮 Sample CTE Programs', '🔮 Sample Fine Arts'],
            testScores: { reading: 100, math: 100 }
          }
        ],
        lastUpdated: new Date().toISOString()
      }
    };
    
    return fallbackData[id as keyof typeof fallbackData] || fallbackData.westlake;
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-6 w-6 text-blue-900" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">School District Details</h2>
                <p className="text-gray-600 text-sm mt-1">Loading education data for {communityName}...</p>
              </div>
            </div>
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Use education data (either from API or fallback)
  const currentEducationData = educationData || getFallbackEducationData(communityId);

  const getSchoolTypeIcon = (type: string) => {
    switch (type) {
      case 'elementary': return '🏫';
      case 'middle': return '🏛️';
      case 'high': return '🎓';
      default: return '🏫';
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'A+': return 'text-green-600 bg-green-100';
      case 'A': return 'text-green-600 bg-green-100';
      case 'B+': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-6">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 flex items-center justify-between text-left hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <GraduationCap className="h-6 w-6 text-blue-900 mr-2" />
                School District Details
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {error ? 'Using sample data - ' : 'Real-time data for '}{currentEducationData.district} serving {communityName}
              </p>
            </div>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600 ml-4" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600 ml-4" />
            )}
          </button>
          <div className="text-right ml-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(currentEducationData.districtRating)}`}>
              <Star className="h-4 w-4 mr-1" />
              {currentEducationData.districtRating}
            </div>
            <p className="text-xs text-gray-500 mt-1">District Rating</p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-6">
          {/* Sample Data Warning Banner */}
          {error && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-800">
                    <strong>🔮 SAMPLE DATA DISPLAYED</strong> - Education API temporarily unavailable. 
                    This is obviously fake demonstration data with perfect scores and crystal ball emojis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* District-wide Statistics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              District Performance Metrics
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : 'bg-green-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Graduation Rate</h4>
                  <Star className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentEducationData.graduationRate}%</p>
                <p className="text-sm text-gray-600 mt-1">{error ? '🔮 Sample vs. State avg: 90%' : 'vs. State avg: 90%'}</p>
              </div>

              <div className={`rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">College Readiness</h4>
                  <BookOpen className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentEducationData.collegeReadinessRate}%</p>
                <p className="text-sm text-gray-600 mt-1">{error ? '🔮 Sample' : 'College ready'} graduates</p>
              </div>

              <div className={`rounded-lg p-4 ${error ? 'bg-amber-50 border border-amber-200' : 'bg-purple-50'}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Student-Teacher Ratio</h4>
                  <Users className="w-4 h-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{currentEducationData.studentTeacherRatio}:1</p>
                <p className="text-sm text-gray-600 mt-1">{error ? '🔮 Sample vs. State avg: 18:1' : 'vs. State avg: 18:1'}</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-600">Total Students</h4>
                  <GraduationCap className="w-4 h-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{(currentEducationData.totalStudents / 1000).toFixed(0)}k</p>
                <p className="text-sm text-gray-600 mt-1">{currentEducationData.schoolsCount} schools</p>
              </div>
            </div>
          </div>

          {/* Test Scores Overview */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              District Test Scores
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Reading</span>
                  <span className="text-lg font-bold text-blue-600">{currentEducationData.averageTestScores.reading}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentEducationData.averageTestScores.reading}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Math</span>
                  <span className="text-lg font-bold text-green-600">{currentEducationData.averageTestScores.math}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentEducationData.averageTestScores.math}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Science</span>
                  <span className="text-lg font-bold text-purple-600">{currentEducationData.averageTestScores.science}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${currentEducationData.averageTestScores.science}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Attainment */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              Community Educational Attainment
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">High School or Higher</h4>
                <p className="text-2xl font-bold text-gray-900">{currentEducationData.educationalAttainment.highSchoolOrHigher}%</p>
                <p className="text-sm text-gray-600 mt-1">vs. National avg: 88%</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Bachelor's or Higher</h4>
                <p className="text-2xl font-bold text-gray-900">{currentEducationData.educationalAttainment.bachelorsOrHigher}%</p>
                <p className="text-sm text-gray-600 mt-1">vs. National avg: 33%</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Graduate/Professional</h4>
                <p className="text-2xl font-bold text-gray-900">{currentEducationData.educationalAttainment.graduateOrProfessional}%</p>
                <p className="text-sm text-gray-600 mt-1">vs. National avg: 13%</p>
              </div>
            </div>
          </div>

          {/* Schools List */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
              Local Schools
            </h3>
            {currentEducationData.schools.map((school: School, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getSchoolTypeIcon(school.type)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{school.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="capitalize">{school.type} School</span>
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {school.distance}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {school.enrollment} students
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRatingColor(school.rating)}`}>
                      <Star className="h-4 w-4 mr-1" />
                      {school.rating}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Overall Score: {school.score}/100</p>
                  </div>
                </div>

                {/* Test Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Reading Proficiency</span>
                      <span className="text-lg font-bold text-blue-600">{school.testScores.reading}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${school.testScores.reading}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Math Proficiency</span>
                      <span className="text-lg font-bold text-green-600">{school.testScores.math}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${school.testScores.math}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Programs */}
                <div>
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Special Programs</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {school.programs.map((program: string, programIndex: number) => (
                      <span
                        key={programIndex}
                        className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full"
                      >
                        <BookOpen className="h-3 w-3 mr-1" />
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* District Information */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">District Highlights</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      2024-2025 School Year
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Start Date: August 26, 2024</li>
                      <li>• End Date: June 5, 2025</li>
                      <li>• Student-Teacher Ratio: {currentEducationData.studentTeacherRatio}:1</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-green-600" />
                      Recognition & Awards
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• TEA Exemplary Rating</li>
                      <li>• National Blue Ribbon Schools</li>
                      <li>• {currentEducationData.graduationRate}% Graduation Rate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* School Boundaries Link */}
          <div className="mt-4 text-center">
            <Link
              to={`/reports?community=${communityId}&section=schools`}
              className="inline-flex items-center px-4 py-2 text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition-colors duration-200"
            >
              <MapPin className="h-4 w-4 mr-2" />
              View School Boundaries & Enrollment Information
            </Link>
          </div>

          {/* Data Source */}
          <div className="mt-6 text-xs text-gray-500 bg-gray-50 rounded p-3">
            <p className="font-medium mb-1">Data Sources:</p>
            <p>{error ? 'Sample data for demonstration purposes' : 'U.S. Census Bureau American Community Survey (ACS) - Real-time education data'}</p>
            <p>Last updated: {new Date(currentEducationData.lastUpdated).toLocaleDateString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
