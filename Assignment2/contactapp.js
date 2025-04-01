// Snack Expo link : https://snack.expo.dev/@jawadaliraza/assignment-
//Code:
import React, { useState } from 'react';
import { View, Text, SectionList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const contactsList = [
  { id: 1, name: 'Ali', number: '03123545525', group: 'Family' },
  { id: 2, name: 'Shayan', number: '033773863', group: 'Friends' },
  { id: 3, name: 'Bilal', number: '0338473874', group: 'Work' },
  { id: 4, name: 'Ejaz', number: '03473984734', group: 'Family' },
  { id: 5, name: 'Attaullah', number: '037364782', group: 'Friends' },
  { id: 6, name: 'Danish', number: '0734687234', group: 'Work' },
  { id: 7, name: 'Taha', number: '0388746299823', group: 'Family' },
  { id: 8, name: 'Usama', number: '038472373964', group: 'Friends' },
  { id: 9, name: 'Hamza', number: '0246452472732', group: 'Work' },
  { id: 10, name: 'Anas', number: '03746235476', group: 'Family' },
];

const ContactsApp = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);

  // Process contacts for display
  const processContacts = () => {
    // Filter by search text
    const filtered = contactsList.filter(contact => 
      contact.name.toLowerCase().includes(searchText.toLowerCase()) || 
      contact.number.includes(searchText)
    );

    // Group contacts by category
    const grouped = filtered.reduce((groups, contact) => {
      const category = contact.group;
      groups[category] = groups[category] || [];
      groups[category].push(contact);
      return groups;
    }, {});

    // Format for SectionList and sort names
    return Object.entries(grouped).map(([category, items]) => ({
      title: category,
      data: items.sort((a, b) => a.name.localeCompare(b.name))
    }));
  };

  return (
    <View style={styles.page}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search contacts..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <SectionList
        sections={processContacts()}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.contactCard}
            onPress={() => setSelectedContact(item)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.number}>{item.number}</Text>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section }) => (
          <Text style={styles.categoryHeader}>{section.title}</Text>
        )}
      />

      <Modal visible={!!selectedContact} transparent>
        <View style={styles.popupBackground}>
          <View style={styles.popup}>
            {selectedContact && (
              <>
                <Text style={styles.popupTitle}>Contact Details</Text>
                <Text>Name: {selectedContact.name}</Text>
                <Text>Number: {selectedContact.number}</Text>
                <Text>Group: {selectedContact.group}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedContact(null)}
                >
                  <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styling remains exactly the same as previous version
const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0'
  },
  searchBox: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: 'white'
  },
  categoryHeader: {
    backgroundColor: 'navy',
    color: 'gold',
    fontWeight: 'bold',
    padding: 8,
    fontSize: 16
  },
  contactCard: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  name: {
    fontSize: 16,
    fontWeight: '500'
  },
  number: {
    color: '#666'
  },
  popupBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%'
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  closeButton: {
    marginTop: 15,
    alignSelf: 'flex-end'
  },
  closeText: {
    color: 'blue',
    fontWeight: '500'
  }
});

export default ContactsApp;
