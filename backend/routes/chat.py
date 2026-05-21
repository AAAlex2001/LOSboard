from fastapi import APIRouter, Depends, File, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from schemas.chat import (
    AttachmentMeta,
    ConversationDetail,
    ConversationListItem,
    MessageResponse,
    SendMessageRequest,
    StartConversationRequest,
    UnreadTotalResponse,
)
from services.auth.dependencies import (
    get_current_user,
    get_current_user_or_query_token,
)
from services.chat.use_cases.get_attachment import GetChatAttachmentUseCase
from services.chat.use_cases.get_conversation import GetConversationUseCase
from services.chat.use_cases.get_unread_total import GetUnreadTotalUseCase
from services.chat.use_cases.list_conversations import ListConversationsUseCase
from services.chat.use_cases.send_message import SendMessageUseCase
from services.chat.use_cases.start_conversation import StartConversationUseCase
from services.chat.use_cases.upload_attachment import UploadChatAttachmentUseCase


router = APIRouter(prefix="/conversations", tags=["chat"])


@router.get("/unread/total", response_model=UnreadTotalResponse)
async def get_unread_total(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = GetUnreadTotalUseCase()
    count = await use_case.get(db=db, current_user=current_user)
    return UnreadTotalResponse(count=count)


@router.get("/", response_model=list[ConversationListItem])
async def list_conversations(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = ListConversationsUseCase()
    return await use_case.list(db=db, current_user=current_user)


@router.post("/", response_model=ConversationDetail)
async def start_conversation(
    request: StartConversationRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    start_use_case = StartConversationUseCase()
    conversation = await start_use_case.start(
        advertisement_id=request.advertisement_id,
        text=request.text,
        db=db,
        current_user=current_user,
    )
    get_use_case = GetConversationUseCase()
    return await get_use_case.get(
        conversation_id=conversation.id,
        db=db,
        current_user=current_user,
    )


@router.get("/{conversation_id}", response_model=ConversationDetail)
async def get_conversation(
    conversation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = GetConversationUseCase()
    return await use_case.get(
        conversation_id=conversation_id,
        db=db,
        current_user=current_user,
    )


@router.post("/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(
    conversation_id: int,
    request: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = SendMessageUseCase()
    return await use_case.send(
        conversation_id=conversation_id,
        text=request.text,
        attachments=request.attachments,
        db=db,
        current_user=current_user,
    )


@router.post(
    "/{conversation_id}/attachments",
    response_model=AttachmentMeta,
)
async def upload_attachment(
    conversation_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    use_case = UploadChatAttachmentUseCase()
    return await use_case.upload(
        conversation_id=conversation_id,
        file=file,
        db=db,
        current_user=current_user,
    )


@router.get("/{conversation_id}/attachments/{filename}")
async def download_attachment(
    conversation_id: int,
    filename: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user_or_query_token),
) -> FileResponse:
    use_case = GetChatAttachmentUseCase()
    return await use_case.get(
        conversation_id=conversation_id,
        filename=filename,
        db=db,
        current_user=current_user,
    )
