import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface VotingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureOption {
  id: string;
  title: string;
  description: string;
}

interface VoteResult {
  optionId: string;
  percentage: number;
}

const VotingModal: React.FC<VotingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('roadmap');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(3700); // Initial value from user request
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);

  const featureOptions: FeatureOption[] = [
    { id: 'feature1', title: t('voting.options.feature1.title'), description: t('voting.options.feature1.description') },
    { id: 'feature2', title: t('voting.options.feature2.title'), description: t('voting.options.feature2.description') },
    { id: 'feature3', title: t('voting.options.feature3.title'), description: t('voting.options.feature3.description') },
    { id: 'feature4', title: t('voting.options.feature4.title'), description: t('voting.options.feature4.description') },
    { id: 'feature5', title: t('voting.options.feature5.title'), description: t('voting.options.feature5.description') },
  ];

  useEffect(() => {
    // Simulate loading user's vote and current results
    // In a real app, this would fetch from a backend
    if (user && isOpen) {
      // Example: Check if user has voted
      const storedVote = localStorage.getItem(`userVote_${user.id}`);
      if (storedVote) {
        setSelectedOption(storedVote);
        setHasVoted(true);
        // Simulate vote distribution
        const initialVotes: { [key: string]: number } = {};
        featureOptions.forEach(opt => initialVotes[opt.id] = Math.floor(Math.random() * 500) + 100); // Random initial votes
        initialVotes[storedVote] += 1; // Add user's vote
        
        const currentTotal = Object.values(initialVotes).reduce((sum, count) => sum + count, 0);
        setTotalVotes(currentTotal);

        const results = featureOptions.map(opt => ({
          optionId: opt.id,
          percentage: (initialVotes[opt.id] / currentTotal) * 100,
        }));
        setVoteResults(results);
      }
    }
  }, [user, isOpen]);

  const handleVote = () => {
    if (!user) {
      alert(t('voting.auth_required'));
      navigate('/auth'); // Redirect to auth page
      return;
    }
    if (!selectedOption) {
      alert(t('voting.select_option'));
      return;
    }
    if (hasVoted) {
      alert(t('voting.already_voted'));
      return;
    }

    // Simulate voting
    localStorage.setItem(`userVote_${user.id}`, selectedOption);
    setHasVoted(true);
    setTotalVotes(prev => prev + 1);

    // Recalculate percentages (simplified simulation)
    const updatedVotes: { [key: string]: number } = {};
    featureOptions.forEach(opt => {
      const currentPercentage = voteResults.find(res => res.optionId === opt.id)?.percentage || 0;
      updatedVotes[opt.id] = Math.round((currentPercentage / 100) * (totalVotes - 1)); // Remove previous total
    });
    updatedVotes[selectedOption] = (updatedVotes[selectedOption] || 0) + 1; // Add new vote

    const currentTotal = Object.values(updatedVotes).reduce((sum, count) => sum + count, 0);
    setTotalVotes(currentTotal);

    const results = featureOptions.map(opt => ({
      optionId: opt.id,
      percentage: (updatedVotes[opt.id] / currentTotal) * 100,
    }));
    setVoteResults(results);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-bg-primary rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-text-primary mb-4">{t('voting.title')}</h2>
        <p className="text-text-secondary mb-6">
          {t('voting.total_votes', { count: totalVotes })}
        </p>

        {!user && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {t('voting.login_to_vote')}
          </div>
        )}

        {hasVoted ? (
          <div className="space-y-4">
            <p className="text-lg font-medium text-green-600">{t('voting.voted_for', { option: featureOptions.find(opt => opt.id === selectedOption)?.title })}</p>
            {voteResults.map(result => (
              <div key={result.optionId} className="flex items-center">
                <span className="w-1/2 text-text-primary">{featureOptions.find(opt => opt.id === result.optionId)?.title}</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-primary-telegram h-4 rounded-full"
                    style={{ width: `${result.percentage}%` }}
                  ></div>
                  <span className="absolute right-2 top-0 text-xs font-bold text-white">{result.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {featureOptions.map(option => (
              <label key={option.id} className="flex items-start p-4 border border-border rounded-lg cursor-pointer hover:bg-bg-tertiary transition-colors">
                <input
                  type="radio"
                  name="featureVote"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="mt-1 mr-3 accent-primary-telegram"
                />
                <div>
                  <h3 className="font-bold text-text-primary">{option.title}</h3>
                  <p className="text-text-secondary text-sm">{option.description}</p>
                </div>
              </label>
            ))}
            <button
              onClick={handleVote}
              disabled={!selectedOption || !user}
              className="w-full py-3 bg-gradient-to-r from-primary-telegram to-primary-electric text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {t('voting.vote_button')}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VotingModal;