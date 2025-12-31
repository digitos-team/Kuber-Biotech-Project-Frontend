import React from 'react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getContent } from '../utils/content';
import Card from '../components/common/card';

// Map string icon names from content.js to Lucide components
const IconMap = {
  Target: LucideIcons.Target,
  Factory: LucideIcons.Factory,
  HandHelping: LucideIcons.HandHelping,
};

const AboutUs = () => {
  const { lang } = useLanguage();
  const content = getContent(lang);
  const { about } = content;
  const VisionIcon = IconMap[about.vision.icon];
  const MissionIcon = IconMap[about.mission.icon];

  // HandHelping icon is used for Core Values
  const ValuesIcon = IconMap['HandHelping'];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 border-b-2 border-green-600 pb-3 inline-block relative">
            {about.title}
          </h2>
        </div>

        {/* Introduction */}
        <div className="max-w-4xl mx-auto mb-16 text-base md:text-lg text-gray-700 leading-relaxed space-y-6 text-justify px-2 md:px-0">
          <p>{about.intro}</p>
          <p>{about.specialization}</p>
          <p>{about.philosophy}</p>
          <p>{about.management}</p>
          <p>{about.operations}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Vision */}
          <Card title={about.vision.title} icon={VisionIcon}>
            <p className="text-gray-600">{about.vision.text}</p>
          </Card>

          {/* Mission */}
          <Card title={about.mission.title} icon={MissionIcon}>
            <ul className="space-y-2 text-gray-600">
              {about.mission.points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2 flex-shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </Card>

          {/* Core Values */}
          <Card title={about.coreValues.title} icon={ValuesIcon}>
            <div className="flex flex-wrap gap-2">
              {about.coreValues.values.map((value, index) => (
                <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  {value}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;