<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Mostrar lista de noticias (acceso público)
     */
    public function index()
    {
        $news = News::with('author:id,name')
            ->orderByDesc('published_at')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($n) {
                return [
                    'id'           => $n->id,
                    'title'        => $n->title,
                    'content'      => $n->content,
                    'published_at' => $n->published_at,
                    'author'       => [
                        'id'   => $n->author?->id,
                        'name' => $n->author?->name,
                    ],
                    'created_at'   => $n->created_at,
                ];
            });

        return response()->json($news);
    }

    /**
     * Mostrar una noticia por ID
     */
    public function show(News $news)
    {
        $news->load('author:id,name');

        return response()->json([
            'id'           => $news->id,
            'title'        => $news->title,
            'content'      => $news->content,
            'published_at' => $news->published_at,
            'author'       => [
                'id'   => $news->author?->id,
                'name' => $news->author?->name,
            ],
            'created_at'   => $news->created_at,
        ]);
    }

    /**
     * Crear noticia (solo admin)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Solo los administradores pueden crear noticias'], 403);
        }

        $data = $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required|string',
            'published_at' => 'nullable|date',
        ]);

        $news = News::create([
            'title'        => $data['title'],
            'content'      => $data['content'],
            'published_at' => $data['published_at'] ?? now(),
            'user_id'      => $user->id,
        ]);

        return response()->json($news, 201);
    }

    /**
     * Editar noticia (solo admin)
     */
    public function update(Request $request, News $news)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Solo los administradores pueden editar noticias'], 403);
        }

        $data = $request->validate([
            'title'        => 'sometimes|required|string|max:255',
            'content'      => 'sometimes|required|string',
            'published_at' => 'nullable|date',
        ]);

        $news->update($data);

        return response()->json($news);
    }

    /**
     * Eliminar noticia (solo admin)
     */
    public function destroy(Request $request, News $news)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Solo los administradores pueden eliminar noticias'], 403);
        }

        $news->delete();

        return response()->json(['message' => 'Noticia eliminada correctamente']);
    }
}
