import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { useTranslation } from 'react-i18next';

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
    // Initialize vote results with random values only when modal opens
    if (isOpen && voteResults.length === 0) { // Only run if results are not already set
      // Check if user has already voted in this session
      const userHasVoted = localStorage.getItem('featureVote');
      if (userHasVoted) {
        setHasVoted(true);
        setSelectedOption(userHasVoted);
      }

      // Generate random total votes between 3000-4000
      const initialTotalVotes = Math.floor(Math.random() * 1001) + 3000;
      setTotalVotes(initialTotalVotes);

      // Generate random vote distribution
      const votes: { [key: string]: number } = {};
      
      // Distribute votes randomly to all options
      let remainingVotes = initialTotalVotes;
      const voteCounts: number[] = [];
      
      // Distribute votes randomly to all options except one (to ensure some votes remain)
      for (let i = 0; i < featureOptions.length - 1; i++) {
        // Random vote count between 10% and 40% of remaining votes
        const maxVotes = Math.floor(remainingVotes * 0.4);
        const minVotes = Math.max(100, Math.floor(remainingVotes * 0.1));
        const voteCount = Math.min(remainingVotes, Math.floor(Math.random() * (maxVotes - minVotes + 1)) + minVotes);
        votes[featureOptions[i].id] = voteCount;
        voteCounts.push(voteCount);
        remainingVotes -= voteCount;
      }

      // Assign remaining votes to the last option
      votes[featureOptions[featureOptions.length - 1].id] = remainingVotes;
      voteCounts.push(remainingVotes);

      // If user has voted, add their vote to the appropriate option
      if (userHasVoted) {
        votes[userHasVoted] = (votes[userHasVoted] || 0) + 1;
        // Update total votes
        setTotalVotes(prev => prev + 1);
      }

      // Calculate percentages
      const results = featureOptions.map(option => ({
        optionId: option.id,
        percentage: (votes[option.id] / (userHasVoted ? initialTotalVotes + 1 : initialTotalVotes)) * 100,
      }));
      
      setVoteResults(results);
    }
  }, [isOpen]); // Only re-run when isOpen changes

  const handleVote = () => {
    if (!selectedOption) {
      alert(t('voting.select_option'));
      return;
    }
    if (hasVoted) {
      // User has already voted, can't vote again
      return;
    }

    // Store that the user has voted
    localStorage.setItem('featureVote', selectedOption);
    setHasVoted(true);
    setTotalVotes(prev => prev + 1);

    // Update the vote count for the selected option
    const updatedResults = voteResults.map(result => {
      if (result.optionId === selectedOption) {
        // Calculate new percentage with the added vote
        return {
          ...result,
          percentage: ((result.percentage * totalVotes / 100) + 1) / (totalVotes + 1) * 100
        };
      } else {
        // Recalculate other percentages based on new total
        return {
          ...result,
          percentage: (result.percentage * totalVotes) / (totalVotes + 1)
        };
      }
    });
    
    setVoteResults(updatedResults);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-bg-primary rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-text-primary mb-4">{t('voting.title')}</h2>
        <p className="text-text-secondary mb-6">
          {totalVotes + (hasVoted ? 0 : 1)}+ {t('voting.total_votes_suffix')}
        </p>

        {hasVoted ? (
          <div className="space-y-4">
            <p className="text-lg font-medium text-green-600">{t('voting.voted_for', { option: featureOptions.find(opt => opt.id === selectedOption)?.title })}</p>
            {voteResults.map(result => (
              <div key={result.optionId} className="flex items-center">
                <span className="w-1/2 text-text-primary">{featureOptions.find(opt => opt.id === result.optionId)?.title}</span>
                <div className="w-1/2 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-primary-telegram h-4 rounded-full"
                    style={{ width: `${result.percentage.toFixed(1)}%` }}
                  ></div>
                  <span className="absolute right-2 top-0 text-xs font-bold text-[#000000]">{result.percentage.toFixed(1)}%</span>
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
              disabled={!selectedOption}
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