import React from 'react';
import {translate} from 'react-i18next';
import UnitSuggestion from './UnitSuggestion';
import AddressSuggestion from './AddressSuggestion';

const SearchSuggestions = translate()(({units, addresses, openAllResults, handleClick, t}) => (
  <div className="search-suggestions">
    {units.length > 0 || addresses.length > 0
      ? <div className="search-suggestions__list">
        {units.length > 0 && <a className="search-suggestions__open-all" onClick={openAllResults}>{t('SEARCH.SHOW_ALL_RESULTS')}</a>}
        {units.map((result) =>
          <UnitSuggestion key={result.id} unit={result}/>
        )}
        {addresses.map((address) =>
          <AddressSuggestion key={address.properties.id} address={address} handleClick={handleClick} />
        )}
        </div>
      : null
    }
  </div>
));

export default SearchSuggestions;