import { useContext } from 'react';
import { documentInterface, documentListInterface } from 'src/shared/interfaces/Data/document-interface';
import { UserUnsafe } from 'src/shared/interfaces/User/user-interface';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDataStore } from 'src/store';
import axios from 'axios';
import { AppContext } from 'src/App';

export const API_URL = 'https://talahanayan-api.vercel.app';
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})
console.log('API_URL:', API_URL);

export function useGetDocuments() {
    const getDocuments = async () => {
        let success: boolean | undefined = undefined;
        let documents: documentListInterface | undefined = undefined;
        let error: string | undefined = undefined;

        console.log(`[ CLIENT ] Fetching from ${API_URL}/documents (GET)`);
        try{
            const response = await api.get(`/documents`);
            success = (response.status >= 200 && response.status < 300) 
            success ? documents = response.data : error = response.data;
        } catch {
            success = false;
        }
        return { success, documents, error };
    };
    return getDocuments;
}

export function useInitDataAsync() {
    const getDocuments = useGetDocuments();
    const initDataAsync = useDataStore(state => state.initDataAsync);
    const fetchData = async () => {
        const { documents, success } = await getDocuments();
        if (documents) initDataAsync(documents);
        return success;
    }
    return fetchData;
}
        
export function useSaveDocument() {
    const initDataAsync = useInitDataAsync();
    const { addToast } = useContext(AppContext);

    const saveDocument = useMutation({
        mutationFn: async ({ document, document_id }: { document: documentInterface | undefined, document_id: string }) => {
            if (!document || !document_id) {
                throw new Error('Missing document or document_id');
            }

            window.document.body.style.cursor = 'wait';
            console.log(`[ CLIENT ] Fetching from ${API_URL}/documents/${document_id} (PUT)`);
            console.log("DATA: ", document);

            const response = await api.put(`/documents/${document_id}`, document, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = response.data;

            if (response.status < 200 || response.status >= 300) {
                throw new Error(data.detail || 'Error saving document');
            }
            if (data.message) console.log(data.message);

            return {
                success: true,
                message: data.message
            };
        },
        onSuccess: async (data) => {
            await initDataAsync(); // Refresh data
            addToast(data?.message,'success');
        },
        onSettled: () => {
            window.document.body.style.cursor = 'default';
        },
        onError: (error: any) => {
            console.error(`[ CLIENT ] Error saving document: ${error.message}`);
            addToast(error, 'error');  
        }
    });

    return saveDocument;
}

export function useCreateNewDocument() {
    const { addToast } = useContext(AppContext);
    const initDataAsync = useInitDataAsync();
    const createNewDocument = useMutation({
        mutationFn: async () => {
            window.document.body.style.cursor = 'wait';
            const response = api.post('/documents/new')
            const data = (await response).data
            if(data.message) console.log(data.message)
            else if(data.detail) console.error(data.detail)
            return {
                success: true,
                message: data.message || data.detail || '',
                document_id: data.document_id
            }            
        },
        onSuccess: async (data) => {
            await initDataAsync(); // Refresh data
            addToast(data?.message,'success');
            
        },
        onSettled: () => {
            window.document.body.style.cursor = 'default';
        },
        onError: (error: any) => {
            console.error(`[ CLIENT ] Error creating document: ${error.message}`);
            addToast(error, 'error');  
        }
    })
    return createNewDocument;
}

export function useDeleteDocument() {
    const { addToast } = useContext(AppContext);
    const initDataAsync = useInitDataAsync();
    const deleteDocument = useMutation({
        mutationFn: async (document_id: string) => {
            window.document.body.style.cursor = 'wait';
            console.log(`[ CLIENT ] Fetching from ${API_URL}/documents/${document_id} (DELETE)`);
            const response = api.delete(`/documents/${document_id}`)
            const data = (await response).data
            if(data.message) console.log(data.message);
            else if(data.detail) console.error(data.detail);
            return {
                success: true,
                message: data.message || data.detail,
            }
        },
        onSuccess: async (data) => {
            await initDataAsync(); // Refresh data
            addToast(data?.message,'success');
            
        },
        onSettled: () => {
            window.document.body.style.cursor = 'default';
        },
        onError: (error: any) => {
            console.error(`[ CLIENT ] Error deleting document: ${error.message}`);
            addToast(error, 'error');  
        }

    })
    return deleteDocument;
}
export function useGetActiveUser() {
    const getActiveUser = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
        console.log('[ CLIENT ] Fetching /active-user (GET)');
        const response = await api.get('/active-user');
        return response.data.user;
    },
  });
  return getActiveUser;
}

export function useSignUpUser(){
    const { addToast } = useContext(AppContext);
    const signUpUser = useMutation({
    mutationFn: async (user: UserUnsafe) => {
        try {
        window.document.body.style.cursor = 'wait';
        console.log(`[ CLIENT ] Fetching from ${API_URL}/register-user`);

        const response = await api.post('/register-user', JSON.stringify(user), {
            headers: {
            "Content-Type": "application/json"
            }
        });

        const data = response.data;
        if (data.message) console.log(data.message);
        else if (data.detail) console.error(data.detail);

        return {
            message: data.message,
            detail: data.detail,
        };
        } catch (error: any) {
        console.error(`[ CLIENT ] Mutation error: ${error.message}`);
        throw error; // Make sure errors propagate to onError/mutateAsync
        } finally {
        window.document.body.style.cursor = 'default';
        }
    },
    onSuccess: async (data) => {
        addToast(data?.message,'success');
        
    },
    onSettled: () => {
        window.document.body.style.cursor = 'default';
    },
    onError: (error: any) => {
        console.error(`[ CLIENT ] Error signing up new user: ${error.message}`);
        addToast(error, 'error');  
    }
    });

    return signUpUser;
}

export function useExportDocument() {

    const exportExcelMutation = useMutation({
        mutationFn: async (document_id: string) => {
            window.document.body.style.cursor = 'wait';
            try {
                console.log(document_id)
                const response = await api.get(`/export/xlsx/${document_id}`, {
                    responseType: 'blob' // assuming you're downloading a file
                });
                // Create a blob URL and trigger download
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'document.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error: any) {
                if (error.response && error.response.status === 0) {
                    alert('Failed to download file due to CORS error. Please contact the server administrator.');
                } else {
                    alert('Failed to download file: ' + (error.message || 'Unknown error'));
                }
                console.error(error);
            }
        },
        onSettled: () => {
            window.document.body.style.cursor = 'default';
        },
    });

    const exportJSON = (doc: documentInterface | undefined) => {
        if(!doc) return;
        window.document.body.style.cursor = 'wait'
        const dataStr = JSON.stringify(doc, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'document.json');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.document.body.style.cursor = 'default'
    }
    const exportExcel = (document_id: string) => {
        exportExcelMutation.mutateAsync(document_id);
    }
    return {exportJSON, exportExcel};
}