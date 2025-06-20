import  { useEffect, useState } from 'react';
import Loader from './loader';
interface Job {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
}

const FetchData = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<string[]>([]);

  useEffect(() => {
   
    fetch('/data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch job data');
        return res.json();
      })
      .then((data) => {
        setTimeout(() => {
          setLoading(true);
          setJobs(data);
          setLoading(false);
        }, 2000);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const addFilter = (tag: string) => {
    if (!filters.includes(tag)) setFilters([...filters, tag]);
  };
  const removeFilter = (tag: string) => {
    setFilters(filters.filter((f) => f !== tag));
  };
  const clearFilters = () => setFilters([]);

  const filterJob = (job: Job) => {
    if (filters.length === 0) return true;
    const jobTags = [job.role, job.level, ...job.languages, ...job.tools];
    return filters.every((f) => jobTags.includes(f));
  };

  if (loading) return <div className="text-center py-8"><Loader /></div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center bg-white p-4 rounded-lg shadow mb-6 gap-2">
          {filters.map((filter) => (
            <span key={filter} className="flex items-center bg-cyan-100 text-cyan-700 font-bold px-2 py-1 rounded">
              {filter}
              <button
                className="ml-2 bg-cyan-700 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-gray-900"
                onClick={() => removeFilter(filter)}
                aria-label={`Remove filter ${filter}`}
              >
                ×
              </button>
            </span>
          ))}
          <button className="ml-auto text-cyan-700 font-bold hover:underline" onClick={clearFilters}>
            Clear
          </button>
        </div>
      )}
      {jobs.filter(filterJob).map((job) => (
        <div
          key={job.id}
          className={`bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row md:items-center border-l-4 ${job.featured ? 'border-cyan-700' : 'border-transparent'}`}
        >
          <img
            src={`/images${job.logo.replace('./images', '')}`}
            alt={job.company}
            className="w-16 h-16 -mt-12 md:mt-0 md:mr-8 md:w-24 md:h-24 object-contain bg-white rounded-full shadow"
          />
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <span className="text-cyan-700 font-bold text-sm">{job.company}</span>
              {job.new && <span className="bg-cyan-700 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">New!</span>}
              {job.featured && <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">Featured</span>}
            </div>
            <h2 className="font-bold text-lg md:text-xl text-gray-900 hover:text-cyan-700 cursor-pointer">{job.position}</h2>
            <div className="flex gap-4 text-gray-500 text-sm">
              <span>{job.postedAt}</span>
              <span>•</span>
              <span>{job.contract}</span>
              <span>•</span>
              <span>{job.location}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0 md:ml-auto">
            {[job.role, job.level, ...job.languages, ...job.tools].map((tag) => (
              <span
                key={tag}
                className="bg-cyan-100 text-cyan-700 font-bold px-2 py-1 rounded cursor-pointer hover:bg-cyan-700 hover:text-white transition"
                onClick={() => addFilter(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {jobs.filter(filterJob).length === 0 && (
        <div className="text-center text-gray-500 py-8">No jobs match the selected filters.</div>
      )}
    </div>
  );
};

export default FetchData;
